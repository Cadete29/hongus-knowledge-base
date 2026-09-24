CREATE TABLE IF NOT EXISTS subscription_orders (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  plan_code varchar(32) NOT NULL CHECK (plan_code IN ('student','professional')),
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency char(3) NOT NULL DEFAULT 'MXN' CHECK (currency = 'MXN'),
  status varchar(24) NOT NULL CHECK (status IN ('created','pending','confirmed','failed','cancelled','reconciliation')),
  idempotency_key varchar(128) NOT NULL,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(account_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS subscription_orders_account_idx ON subscription_orders(account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  order_id uuid NOT NULL UNIQUE REFERENCES subscription_orders(id),
  plan_code varchar(32) NOT NULL CHECK (plan_code IN ('student','professional')),
  status varchar(24) NOT NULL CHECK (status IN ('active','expired')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  mentoring_allowance integer NOT NULL,
  mentoring_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscriptions_current_idx ON subscriptions(account_id, ends_at DESC);

CREATE TABLE IF NOT EXISTS academic_accreditations (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status varchar(24) NOT NULL CHECK (status IN ('draft','pending','correction_required','approved','rejected','expired')),
  valid_until date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS academic_accreditations_account_idx ON academic_accreditations(account_id, updated_at DESC);
