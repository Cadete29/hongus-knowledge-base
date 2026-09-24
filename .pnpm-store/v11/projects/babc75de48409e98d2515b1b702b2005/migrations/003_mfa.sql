ALTER TABLE accounts ADD COLUMN IF NOT EXISTS mfa_secret_ciphertext text;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS mfa_enabled_at timestamptz;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS mfa_last_counter bigint;

CREATE TABLE IF NOT EXISTS mfa_recovery_codes (
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  code_hash char(64) NOT NULL,
  used_at timestamptz,
  PRIMARY KEY (account_id, code_hash)
);

CREATE TABLE IF NOT EXISTS mfa_challenges (
  token_hash char(64) PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mfa_challenges_account_idx ON mfa_challenges(account_id);
