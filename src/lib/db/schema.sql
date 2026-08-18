-- ====================================================================
-- OBRA CLARA — lead pipeline schema (PostgreSQL)
-- ====================================================================
-- Applies automatically on boot via `ensureSchema()` (src/lib/db/index.ts)
-- when DATABASE_URL is set. Kept here for reference and manual setup.
-- ====================================================================

CREATE TABLE IF NOT EXISTS leads (
  id                 BIGSERIAL PRIMARY KEY,
  lead_id            TEXT NOT NULL UNIQUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  status             TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new','contacted','qualified',
                                       'visit_scheduled','quote_sent',
                                       'won','lost')),

  -- Lead form data
  name               TEXT NOT NULL,
  phone              TEXT NOT NULL,
  email              TEXT,
  reform_type        TEXT NOT NULL,
  area               TEXT,
  size_m2            NUMERIC,
  property_type      TEXT,      -- legacy (previous form version)
  postal_code        TEXT,      -- legacy (previous form version)
  property_size      TEXT,      -- legacy (previous form version)
  start_timeframe    TEXT NOT NULL,

  -- First-party attribution (never PII is sent to analytics)
  landing_page       TEXT,
  referrer           TEXT,
  utm_source         TEXT,
  utm_medium         TEXT,
  utm_campaign       TEXT,
  utm_term           TEXT,
  utm_content        TEXT,
  gclid              TEXT,
  gbraid             TEXT,
  wbraid             TEXT,
  fbclid             TEXT,
  msclkid            TEXT,
  first_touch_source  TEXT,
  first_touch_landing TEXT,
  last_touch_source   TEXT,
  last_touch_landing  TEXT,

  -- Metadata
  user_agent         TEXT,
  consent_at         TIMESTAMPTZ,

  -- Commercial pipeline
  assigned_provider  TEXT,
  quote_amount       NUMERIC(12,2),
  contract_amount    NUMERIC(12,2),
  collected_amount   NUMERIC(12,2),
  lost_reason        TEXT,
  internal_notes     TEXT,
  commission_rate    NUMERIC(5,4) NOT NULL DEFAULT 0.05,
  commission_basis   TEXT NOT NULL DEFAULT 'collected_amount'
                     CHECK (commission_basis IN ('contract_amount','collected_amount')),
  notify_status      TEXT
                     CHECK (notify_status IN ('pending','sent','failed','disabled'))
);

CREATE INDEX IF NOT EXISTS leads_status_idx     ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_idx    ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_utm_source_idx ON leads (utm_source);
CREATE INDEX IF NOT EXISTS leads_lead_id_idx    ON leads (lead_id);
