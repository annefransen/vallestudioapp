-- Add increment_promo_usage RPC function used by the booking API
create or replace function public.increment_promo_usage(promo_id uuid)
returns void
language sql
security definer
as $$
  update public.promotions
  set uses_count = uses_count + 1
  where id = promo_id;
$$;
