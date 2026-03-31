-- Migration: 003_stylists
-- Description: Add stylists for dynamic scheduling

create table public.stylists (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    specialty text,
    avatar_url text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.stylists enable row level security;

-- Policies for public reading
create policy "Stylists are viewable by everyone"
on public.stylists for select
using ( true );

-- Admin only for updates
create policy "Admins can insert stylists"
on public.stylists for insert
to authenticated
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can update stylists"
on public.stylists for update
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can delete stylists"
on public.stylists for delete
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Add stylist tracking to bookings
alter table public.bookings 
add column stylist_id uuid references public.stylists(id) on delete set null;
