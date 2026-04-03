-- Western Cape Mortuary Finder - Initial Schema
-- Migration 001: Create core tables

-- Cities reference table
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  province VARCHAR(100) NOT NULL DEFAULT 'Western Cape'
);

-- Mortuaries
CREATE TABLE mortuaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  address TEXT NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id),
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  availability VARCHAR(20) NOT NULL DEFAULT 'available'
    CHECK (availability IN ('available', 'limited', 'full')),
  price_range VARCHAR(20)
    CHECK (price_range IN ('budget', 'mid-range', 'premium')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  contact_clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services offered by mortuaries
CREATE TABLE mortuary_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mortuary_id UUID NOT NULL REFERENCES mortuaries(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL
);

-- Operating hours
CREATE TABLE mortuary_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mortuary_id UUID NOT NULL REFERENCES mortuaries(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(mortuary_id, day_of_week)
);

-- Indexes for common queries
CREATE INDEX idx_mortuaries_city_id ON mortuaries(city_id);
CREATE INDEX idx_mortuaries_availability ON mortuaries(availability);
CREATE INDEX idx_mortuaries_active_approved ON mortuaries(is_active, is_approved);
CREATE INDEX idx_mortuaries_slug ON mortuaries(slug);
CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_mortuary_services_mortuary_id ON mortuary_services(mortuary_id);
CREATE INDEX idx_mortuary_hours_mortuary_id ON mortuary_hours(mortuary_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON mortuaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE mortuaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortuary_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortuary_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Cities: anyone can read
CREATE POLICY "Anyone can read cities"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);

-- Mortuaries: public can read active+approved, owners can manage their own
CREATE POLICY "Public read active approved mortuaries"
  ON mortuaries FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND is_approved = true);

CREATE POLICY "Owners can read own mortuary"
  ON mortuaries FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own mortuary"
  ON mortuaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own mortuary"
  ON mortuaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Mortuary services: public read for active mortuaries, owners manage
CREATE POLICY "Public read services of active mortuaries"
  ON mortuary_services FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_services.mortuary_id
    AND mortuaries.is_active = true AND mortuaries.is_approved = true
  ));

CREATE POLICY "Owners read own services"
  ON mortuary_services FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_services.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

CREATE POLICY "Owners manage own services"
  ON mortuary_services FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_services.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

CREATE POLICY "Owners delete own services"
  ON mortuary_services FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_services.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

-- Mortuary hours: same pattern
CREATE POLICY "Public read hours of active mortuaries"
  ON mortuary_hours FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_hours.mortuary_id
    AND mortuaries.is_active = true AND mortuaries.is_approved = true
  ));

CREATE POLICY "Owners read own hours"
  ON mortuary_hours FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_hours.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

CREATE POLICY "Owners manage own hours"
  ON mortuary_hours FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_hours.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

CREATE POLICY "Owners update own hours"
  ON mortuary_hours FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_hours.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

CREATE POLICY "Owners delete own hours"
  ON mortuary_hours FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = mortuary_hours.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));
