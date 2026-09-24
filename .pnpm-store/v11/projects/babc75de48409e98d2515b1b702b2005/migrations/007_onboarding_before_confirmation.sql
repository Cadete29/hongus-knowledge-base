ALTER TABLE accounts ADD COLUMN IF NOT EXISTS intended_plan varchar(32) CHECK (intended_plan IN ('free','student','professional'));
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;
ALTER TABLE academic_accreditations ADD COLUMN IF NOT EXISTS institution varchar(160);
ALTER TABLE academic_accreditations ADD COLUMN IF NOT EXISTS academic_level varchar(80);
ALTER TABLE academic_accreditations ADD COLUMN IF NOT EXISTS evidence_name varchar(255);

CREATE TABLE IF NOT EXISTS pending_onboarding (
  token_hash char(64) PRIMARY KEY,
  account_id uuid NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
