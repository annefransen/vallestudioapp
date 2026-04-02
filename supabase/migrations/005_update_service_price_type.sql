-- Update the `price_type` constraint to allow 'fixed' or 'starting' instead of 'standard' or 'promotional'

-- First, drop the old strict constraint on the services table
ALTER TABLE public.services
DROP CONSTRAINT IF EXISTS services_price_type_check;

-- Add the new constraint allowing 'fixed' and 'starting'
ALTER TABLE public.services
ADD CONSTRAINT services_price_type_check 
CHECK (price_type IN ('fixed', 'starting'));
