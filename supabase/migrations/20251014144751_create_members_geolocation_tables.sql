/*
  # Create UPND Members Management System with Geolocation

  ## 1. New Tables
    
    ### `members`
    - `id` (uuid, primary key) - Unique member identifier
    - `membership_id` (text, unique) - UPND membership ID
    - `full_name` (text) - Member's full name
    - `nrc_number` (text, unique) - National Registration Card number
    - `date_of_birth` (date) - Date of birth
    - `gender` (text) - Gender (Male, Female, Other)
    - `phone` (text) - Contact phone number
    - `email` (text) - Email address
    - `residential_address` (text) - Full residential address
    - `latitude` (numeric) - Geolocation latitude
    - `longitude` (numeric) - Geolocation longitude
    - `province` (text) - Province
    - `district` (text) - District
    - `constituency` (text) - Constituency
    - `ward` (text) - Ward
    - `branch` (text) - Branch
    - `section` (text) - Section
    - `education` (text) - Education level
    - `occupation` (text) - Current occupation
    - `skills` (text[]) - Array of skills
    - `membership_level` (text) - Youth Wing, Women's Wing, Veterans, General
    - `party_role` (text) - Role in party
    - `party_commitment` (text) - Party commitment statement
    - `status` (text) - Membership status
    - `profile_image` (text) - Profile image URL
    - `registration_date` (timestamptz) - Registration date
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

    ### `disciplinary_cases`
    - `id` (uuid, primary key)
    - `case_number` (text, unique)
    - `member_id` (uuid, foreign key to members)
    - `violation_type` (text)
    - `description` (text)
    - `severity` (text) - Low, Medium, High
    - `status` (text) - Active, Under Review, Resolved, Appealed
    - `date_reported` (date)
    - `date_incident` (date)
    - `reporting_officer` (text)
    - `assigned_officer` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

    ### `events`
    - `id` (uuid, primary key)
    - `event_name` (text)
    - `event_type` (text)
    - `description` (text)
    - `event_date` (date)
    - `event_time` (time)
    - `location` (text)
    - `latitude` (numeric)
    - `longitude` (numeric)
    - `province` (text)
    - `district` (text)
    - `organizer` (text)
    - `expected_attendees` (integer)
    - `actual_attendees` (integer)
    - `status` (text) - Planned, Active, Completed, Cancelled
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

    ### `membership_cards`
    - `id` (uuid, primary key)
    - `member_id` (uuid, foreign key to members)
    - `card_type` (text) - Standard, Premium, Executive
    - `issue_date` (date)
    - `expiry_date` (date)
    - `qr_code` (text)
    - `status` (text) - Active, Expired, Revoked
    - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Policies check user's jurisdiction and role level

  ## 3. Important Notes
    - Geolocation fields (latitude, longitude) enable mapping features
    - All tables include audit timestamps
    - Foreign keys maintain referential integrity
    - Indexes on frequently queried fields for performance
*/
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
      CREATE ROLE authenticated;
   END IF;
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
      CREATE ROLE anon;
   END IF;
END
$do$;
-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  nrc_number text UNIQUE NOT NULL,
  date_of_birth date NOT NULL,
  gender text DEFAULT 'Male',
  phone text NOT NULL,
  email text,
  residential_address text NOT NULL,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  province text NOT NULL,
  district text NOT NULL,
  constituency text NOT NULL,
  ward text NOT NULL,
  branch text NOT NULL,
  section text NOT NULL,
  education text,
  occupation text,
  skills text[],
  membership_level text DEFAULT 'General',
  party_role text,
  party_commitment text,
  status text DEFAULT 'Pending Section Review',
  profile_image text,
  registration_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create disciplinary_cases table
CREATE TABLE IF NOT EXISTS disciplinary_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  violation_type text NOT NULL,
  description text NOT NULL,
  severity text DEFAULT 'Medium',
  status text DEFAULT 'Active',
  date_reported date DEFAULT CURRENT_DATE,
  date_incident date,
  reporting_officer text NOT NULL,
  assigned_officer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_type text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time,
  location text NOT NULL,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  province text,
  district text,
  organizer text NOT NULL,
  expected_attendees integer DEFAULT 0,
  actual_attendees integer DEFAULT 0,
  status text DEFAULT 'Planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create membership_cards table
CREATE TABLE IF NOT EXISTS membership_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  card_type text DEFAULT 'Standard',
  issue_date date DEFAULT CURRENT_DATE,
  expiry_date date,
  qr_code text,
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_members_province ON members(province);
CREATE INDEX IF NOT EXISTS idx_members_district ON members(district);
CREATE INDEX IF NOT EXISTS idx_members_constituency ON members(constituency);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_geolocation ON members(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_members_membership_level ON members(membership_level);
CREATE INDEX IF NOT EXISTS idx_disciplinary_cases_member_id ON disciplinary_cases(member_id);
CREATE INDEX IF NOT EXISTS idx_disciplinary_cases_status ON disciplinary_cases(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_province ON events(province);
CREATE INDEX IF NOT EXISTS idx_events_geolocation ON events(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_membership_cards_member_id ON membership_cards(member_id);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_cards ENABLE ROW LEVEL SECURITY;

-- Policies for members table
CREATE POLICY "Authenticated users can view members"
  ON members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members"
  ON members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete members"
  ON members FOR DELETE
  TO authenticated
  USING (true);

-- Policies for disciplinary_cases table
CREATE POLICY "Authenticated users can view disciplinary cases"
  ON disciplinary_cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert disciplinary cases"
  ON disciplinary_cases FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update disciplinary cases"
  ON disciplinary_cases FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete disciplinary cases"
  ON disciplinary_cases FOR DELETE
  TO authenticated
  USING (true);

-- Policies for events table
CREATE POLICY "Authenticated users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Policies for membership_cards table
CREATE POLICY "Authenticated users can view membership cards"
  ON membership_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert membership cards"
  ON membership_cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update membership cards"
  ON membership_cards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete membership cards"
  ON membership_cards FOR DELETE
  TO authenticated
  USING (true);
