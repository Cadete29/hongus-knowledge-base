ALTER TABLE accounts ADD COLUMN IF NOT EXISTS terms_version varchar(64);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS terms_sha256 char(64);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS privacy_version varchar(64);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS privacy_sha256 char(64);
