-- ============================================================
-- Valle Studio Salon — Initial Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with role and contact info
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SERVICES
-- Hair, Nails, Brows services with pricing
-- ============================================================
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text not null check (category in ('hair', 'nails', 'brows')),
  duration_min integer not null default 60,
  price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed default services
insert into public.services (name, description, category, duration_min, price) values
  ('Haircut & Style', 'Professional cut and style by our expert stylists', 'hair', 60, 350),
  ('Hair Color (Full)', 'Full hair coloring with premium products', 'hair', 120, 1200),
  ('Hair Color (Highlights)', 'Partial highlights for a natural look', 'hair', 90, 900),
  ('Hair Treatment', 'Deep conditioning and repair treatment', 'hair', 60, 600),
  ('Blowout & Style', 'Wash, blowdry and style', 'hair', 45, 280),
  ('Manicure (Classic)', 'Classic manicure with nail shaping and polish', 'nails', 45, 250),
  ('Pedicure (Classic)', 'Classic pedicure with foot soak and polish', 'nails', 60, 350),
  ('Gel Nails', 'Long-lasting gel nail application', 'nails', 75, 500),
  ('Nail Art', 'Custom nail art designs', 'nails', 60, 450),
  ('Eyebrow Threading', 'Precise eyebrow shaping by threading', 'brows', 20, 120),
  ('Eyebrow Tinting', 'Semi-permanent brow tinting for definition', 'brows', 30, 200),
  ('Brow Lamination', 'Brow lamination for a groomed, brushed-up look', 'brows', 45, 650);

-- ============================================================
-- PROMOTIONS
-- Discount codes that customers can apply during booking
-- ============================================================
create table public.promotions (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null,
  min_amount numeric(10,2) default 0,
  valid_from date not null default current_date,
  valid_to date not null,
  max_uses integer,
  uses_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- Core reservation table (supports both registered and guests)
-- ============================================================
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  -- Registered customer (nullable for guests and walk-ins)
  profile_id uuid references public.profiles(id) on delete set null,
  -- Guest / walk-in contact info
  guest_name text,
  guest_phone text,
  guest_email text,
  -- Appointment details
  service_id uuid references public.services(id) on delete restrict not null,
  stylist_name text,
  booking_date date not null,
  booking_time time not null,
  -- Status workflow
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes text,
  -- Walk-in flag (admin-added)
  is_walkin boolean not null default false,
  -- Promotion applied
  promotion_id uuid references public.promotions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Constraint: must have either profile_id or guest info
  constraint booking_has_contact check (
    profile_id is not null or guest_name is not null
  )
);

-- ============================================================
-- PAYMENTS
-- Payment records linked to bookings
-- ============================================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade not null,
  method text not null check (method in ('cash', 'gcash_instore', 'gcash_online')),
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  -- Xendit fields (for online GCash)
  xendit_invoice_id text,
  xendit_invoice_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.promotions enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

-- Helper function: check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins have full access to profiles" on public.profiles
  for all using (public.is_admin());

-- SERVICES policies (public read, admin write)
create policy "Anyone can view active services" on public.services
  for select using (is_active = true);
create policy "Admins can manage services" on public.services
  for all using (public.is_admin());

-- PROMOTIONS policies (public read for active, admin write)
create policy "Anyone can view active promotions" on public.promotions
  for select using (is_active = true and valid_to >= current_date);
create policy "Admins can manage promotions" on public.promotions
  for all using (public.is_admin());

-- BOOKINGS policies
create policy "Customers view own bookings" on public.bookings
  for select using (auth.uid() = profile_id);
create policy "Anyone can create a booking" on public.bookings
  for insert with check (true);
create policy "Customers can cancel own bookings" on public.bookings
  for update using (auth.uid() = profile_id);
create policy "Admins have full access to bookings" on public.bookings
  for all using (public.is_admin());

-- PAYMENTS policies
create policy "Customers view payments for own bookings" on public.payments
  for select using (
    exists (
      select 1 from public.bookings
      where bookings.id = booking_id and bookings.profile_id = auth.uid()
    )
  );
create policy "Admins have full access to payments" on public.payments
  for all using (public.is_admin());

-- ============================================================
-- UPDATED_AT trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_bookings_updated_at before update on public.bookings
  for each row execute procedure public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments
  for each row execute procedure public.set_updated_at();
