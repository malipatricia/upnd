/*
  # Update RLS Policies for Anonymous Access

  ## Changes
    - Update policies to allow anon role access for reading data
    - Keep insert/update/delete restricted to authenticated users
    - This allows the frontend to display map data without authentication
  
  ## Security Note
    - For production, implement proper authentication
    - Current setup allows public read access for demo purposes
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view members" ON members;
DROP POLICY IF EXISTS "Authenticated users can insert members" ON members;
DROP POLICY IF EXISTS "Authenticated users can update members" ON members;
DROP POLICY IF EXISTS "Authenticated users can delete members" ON members;

-- Create new policies that allow anon access for reading
CREATE POLICY "Allow anon to view members"
  ON members FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view members"
  ON members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update members"
  ON members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete members"
  ON members FOR DELETE
  TO authenticated
  USING (true);

-- Update events policies
DROP POLICY IF EXISTS "Authenticated users can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

CREATE POLICY "Allow anon to view events"
  ON events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Update disciplinary_cases policies
DROP POLICY IF EXISTS "Authenticated users can view disciplinary cases" ON disciplinary_cases;
DROP POLICY IF EXISTS "Authenticated users can insert disciplinary cases" ON disciplinary_cases;
DROP POLICY IF EXISTS "Authenticated users can update disciplinary cases" ON disciplinary_cases;
DROP POLICY IF EXISTS "Authenticated users can delete disciplinary cases" ON disciplinary_cases;

CREATE POLICY "Allow anon to view disciplinary cases"
  ON disciplinary_cases FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view disciplinary cases"
  ON disciplinary_cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert disciplinary cases"
  ON disciplinary_cases FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update disciplinary cases"
  ON disciplinary_cases FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete disciplinary cases"
  ON disciplinary_cases FOR DELETE
  TO authenticated
  USING (true);

-- Update membership_cards policies
DROP POLICY IF EXISTS "Authenticated users can view membership cards" ON membership_cards;
DROP POLICY IF EXISTS "Authenticated users can insert membership cards" ON membership_cards;
DROP POLICY IF EXISTS "Authenticated users can update membership cards" ON membership_cards;
DROP POLICY IF EXISTS "Authenticated users can delete membership cards" ON membership_cards;

CREATE POLICY "Allow anon to view membership cards"
  ON membership_cards FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view membership cards"
  ON membership_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert membership cards"
  ON membership_cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update membership cards"
  ON membership_cards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete membership cards"
  ON membership_cards FOR DELETE
  TO authenticated
  USING (true);
