-- Western Cape Mortuary Finder - Reviews
-- Migration 003: Reviews and ratings system

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mortuary_id UUID NOT NULL REFERENCES mortuaries(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_phone VARCHAR(20) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_mortuary_id ON reviews(mortuary_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a review
CREATE POLICY "Anyone can submit review"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public can read approved reviews
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Mortuary owners can read all reviews for their mortuaries
CREATE POLICY "Owners read own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = reviews.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

-- Mortuary owners can update (approve/reject) reviews
CREATE POLICY "Owners update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = reviews.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));
