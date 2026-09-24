ALTER TABLE sessions ADD COLUMN IF NOT EXISTS family_id uuid;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS replaced_by_id uuid;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS csrf_hash char(64);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address inet;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent varchar(512);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS revoked_reason varchar(32);
CREATE INDEX IF NOT EXISTS sessions_family_idx ON sessions(family_id);
UPDATE sessions SET revoked_at=now(), revoked_reason='security_upgrade' WHERE csrf_hash IS NULL AND revoked_at IS NULL;
