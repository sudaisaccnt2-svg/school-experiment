PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY, email TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS accounts_email ON accounts(email);
CREATE TABLE IF NOT EXISTS memberships (
  user_id TEXT PRIMARY KEY REFERENCES accounts(id), pro_until INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT OR IGNORE INTO settings(id, value) VALUES('public', '{"monthlyPaisa":null,"yearlyPaisa":null,"manualPayments":false,"paymentInstructions":"","adsEnabled":false,"adsApproved":false,"publisherId":"","adSlot":""}');
CREATE TABLE IF NOT EXISTS access_codes (
  id TEXT PRIMARY KEY, code_hash TEXT UNIQUE NOT NULL, days INTEGER NOT NULL CHECK(days BETWEEN 1 AND 3650),
  expires_at INTEGER NOT NULL, redeemed_by TEXT REFERENCES accounts(id), redeemed_at INTEGER,
  redemption_nonce TEXT, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES accounts(id), plan TEXT NOT NULL,
  amount_paisa INTEGER NOT NULL CHECK(amount_paisa > 0), days INTEGER NOT NULL,
  method TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','reported','paid','rejected')),
  reference TEXT, created_at INTEGER NOT NULL, paid_at INTEGER, fulfillment_nonce TEXT,
  plan_name TEXT, base_amount_paisa INTEGER, discount_paisa INTEGER NOT NULL DEFAULT 0,
  discount_label TEXT NOT NULL DEFAULT '', coupon_code TEXT, quote_expires_at INTEGER, cancelled_at INTEGER
);
CREATE INDEX IF NOT EXISTS orders_user ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS orders_status ON orders(status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS paid_reference ON orders(method, reference) WHERE status = 'paid';
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL, action TEXT NOT NULL,
  target TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS account_controls (
  user_id TEXT PRIMARY KEY REFERENCES accounts(id), status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended')),
  student_name TEXT NOT NULL DEFAULT '', class_label TEXT NOT NULL DEFAULT '', private_note TEXT NOT NULL DEFAULT '',
  last_seen INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS controls_class ON account_controls(class_label);
CREATE TABLE IF NOT EXISTS owner_sessions (
  token_hash TEXT PRIMARY KEY, credential_tag TEXT NOT NULL, email TEXT NOT NULL,
  expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS owner_sessions_expiry ON owner_sessions(expires_at);
CREATE TABLE IF NOT EXISTS student_credentials (
  user_id TEXT PRIMARY KEY REFERENCES accounts(id), username TEXT UNIQUE NOT NULL,
  password_salt TEXT NOT NULL, password_hash TEXT NOT NULL, hash_version TEXT NOT NULL,
  recovery_hash TEXT NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS student_sessions (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES student_credentials(user_id),
  credential_tag TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS student_sessions_user ON student_sessions(user_id,created_at);
CREATE INDEX IF NOT EXISTS student_sessions_expiry ON student_sessions(expires_at);
CREATE TABLE IF NOT EXISTS play_purchases (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES accounts(id),
  token_cipher TEXT NOT NULL, product_id TEXT NOT NULL, account_binding TEXT NOT NULL,
  state TEXT NOT NULL, expires_at INTEGER NOT NULL DEFAULT 0,
  acknowledged INTEGER NOT NULL DEFAULT 0, verified_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS play_customer ON play_purchases(user_id,expires_at);
CREATE INDEX IF NOT EXISTS rate_limits_expiry ON rate_limits(expires_at);
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY, type TEXT NOT NULL CHECK(type IN ('percent','fixed')), value INTEGER NOT NULL CHECK(value>0),
  active INTEGER NOT NULL DEFAULT 0, listed INTEGER NOT NULL DEFAULT 1, starts_at INTEGER, ends_at INTEGER,
  min_paisa INTEGER NOT NULL DEFAULT 0, max_uses INTEGER, per_user_limit INTEGER, tier_ids TEXT NOT NULL,
  version TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  order_id TEXT PRIMARY KEY, code TEXT NOT NULL REFERENCES coupons(code), user_id TEXT NOT NULL REFERENCES accounts(id),
  state TEXT NOT NULL CHECK(state IN ('reserved','reported','used','released')), expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS coupon_capacity ON coupon_redemptions(code,state,expires_at);
CREATE INDEX IF NOT EXISTS coupon_customer ON coupon_redemptions(code,user_id,state,expires_at);
INSERT OR IGNORE INTO settings(id,value) VALUES('website','{"siteTitle":"Asawera Science","contactEmail":"","announcement":"","registrationsOpen":false}');
