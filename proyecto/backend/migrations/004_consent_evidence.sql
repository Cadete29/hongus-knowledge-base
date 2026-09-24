ALTER TABLE accounts ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS privacy_acknowledged_at timestamptz;
