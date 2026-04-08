-- Western Cape Mortuary Finder - Subscription Tiers
-- Migration 004: Add subscription tier to mortuaries

ALTER TABLE mortuaries
  ADD COLUMN subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'standard', 'premium'));

ALTER TABLE mortuaries
  ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE mortuaries
  ADD COLUMN verified_partner BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX idx_mortuaries_tier ON mortuaries(subscription_tier);
CREATE INDEX idx_mortuaries_featured ON mortuaries(is_featured);
