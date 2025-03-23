-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS initial_investment DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS monthly_contribution DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS preferred_asset_types TEXT[],
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to have default values
UPDATE profiles
SET 
  initial_investment = 0,
  monthly_contribution = 0,
  preferred_asset_types = ARRAY['stocks', 'bonds'],
  updated_at = CURRENT_TIMESTAMP
WHERE initial_investment IS NULL;

-- Add NOT NULL constraints
ALTER TABLE profiles
ALTER COLUMN initial_investment SET NOT NULL,
ALTER COLUMN monthly_contribution SET NOT NULL,
ALTER COLUMN preferred_asset_types SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL; 