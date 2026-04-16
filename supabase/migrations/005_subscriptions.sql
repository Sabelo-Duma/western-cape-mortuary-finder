-- Migration 005: Subscriptions & Payments for PayFast billing
-- Adds subscription management and payment audit trail

-- ============================================================
-- Table: subscriptions
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mortuary_id UUID NOT NULL REFERENCES mortuaries(id) ON DELETE CASCADE,
  payfast_token VARCHAR(255),
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('standard', 'premium')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'cancelled', 'failed')),
  amount_cents INTEGER NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(mortuary_id)
);

CREATE INDEX idx_subscriptions_mortuary ON subscriptions(mortuary_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================================
-- Table: payments (audit log of every PayFast ITN)
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  mortuary_id UUID NOT NULL REFERENCES mortuaries(id) ON DELETE CASCADE,
  pf_payment_id VARCHAR(255),
  amount_cents INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  raw_itn JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_mortuary ON payments(mortuary_id);

-- ============================================================
-- Trigger: sync mortuaries.subscription_tier on status change
-- ============================================================
CREATE OR REPLACE FUNCTION sync_mortuary_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE mortuaries
    SET subscription_tier = NEW.tier,
        is_featured = (NEW.tier = 'premium'),
        verified_partner = (NEW.tier = 'premium'),
        updated_at = now()
    WHERE id = NEW.mortuary_id;
  ELSIF NEW.status IN ('cancelled', 'failed') THEN
    UPDATE mortuaries
    SET subscription_tier = 'free',
        is_featured = false,
        verified_partner = false,
        updated_at = now()
    WHERE id = NEW.mortuary_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_mortuary_tier
  AFTER INSERT OR UPDATE OF status ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_mortuary_tier();

-- ============================================================
-- RLS: owners can read their own; writes via service role only
-- ============================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (mortuary_id IN (
    SELECT id FROM mortuaries WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Owners can view own payments"
  ON payments FOR SELECT
  USING (mortuary_id IN (
    SELECT id FROM mortuaries WHERE owner_id = auth.uid()
  ));
