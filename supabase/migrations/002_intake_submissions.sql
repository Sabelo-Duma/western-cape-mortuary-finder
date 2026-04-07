-- Western Cape Mortuary Finder - Intake Submissions
-- Migration 002: Digital intake form submissions

CREATE TABLE intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mortuary_id UUID NOT NULL REFERENCES mortuaries(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in-progress', 'completed', 'cancelled')),

  -- Deceased information
  deceased_full_name VARCHAR(255) NOT NULL,
  deceased_id_number VARCHAR(13),
  deceased_date_of_birth DATE,
  deceased_date_of_death DATE NOT NULL,
  deceased_gender VARCHAR(20) NOT NULL CHECK (deceased_gender IN ('male', 'female', 'other')),
  deceased_address TEXT,
  deceased_marital_status VARCHAR(20)
    CHECK (deceased_marital_status IN ('single', 'married', 'divorced', 'widowed')),
  deceased_spouse_name VARCHAR(255),

  -- Death details
  death_scenario VARCHAR(20) NOT NULL
    CHECK (death_scenario IN ('hospital', 'home', 'unnatural', 'other')),
  death_location TEXT,
  hospital_name VARCHAR(255),
  saps_case_number VARCHAR(50),

  -- Doctor details
  doctor_name VARCHAR(255),
  doctor_practice_number VARCHAR(50),
  doctor_phone VARCHAR(20),

  -- Next-of-kin / informant
  nok_full_name VARCHAR(255) NOT NULL,
  nok_id_number VARCHAR(13),
  nok_relationship VARCHAR(50) NOT NULL,
  nok_phone VARCHAR(20) NOT NULL,
  nok_email VARCHAR(255),
  nok_address TEXT,

  -- Preferences
  disposition VARCHAR(20) NOT NULL DEFAULT 'burial'
    CHECK (disposition IN ('burial', 'cremation', 'undecided')),
  religion VARCHAR(100),
  cultural_requirements TEXT,
  urgent_burial BOOLEAN NOT NULL DEFAULT false,

  -- Insurance
  has_funeral_policy BOOLEAN NOT NULL DEFAULT false,
  insurance_provider VARCHAR(255),
  policy_number VARCHAR(100),

  -- Notes
  additional_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_intake_mortuary_id ON intake_submissions(mortuary_id);
CREATE INDEX idx_intake_status ON intake_submissions(status);
CREATE INDEX idx_intake_created ON intake_submissions(created_at DESC);

-- Auto-update timestamp
CREATE TRIGGER set_intake_updated_at
  BEFORE UPDATE ON intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

-- Families can insert (anyone can submit)
CREATE POLICY "Anyone can submit intake"
  ON intake_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Mortuary owners can read submissions for their mortuaries
CREATE POLICY "Owners read own intake submissions"
  ON intake_submissions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = intake_submissions.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));

-- Mortuary owners can update status on their submissions
CREATE POLICY "Owners update own intake submissions"
  ON intake_submissions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM mortuaries
    WHERE mortuaries.id = intake_submissions.mortuary_id
    AND mortuaries.owner_id = auth.uid()
  ));
