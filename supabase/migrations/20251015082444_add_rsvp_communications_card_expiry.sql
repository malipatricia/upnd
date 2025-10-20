/*
  # Add RSVP, Communications, and Card Expiry Features

  ## 1. New Tables
    
    ### `event_rsvps`
    - `id` (uuid, primary key)
    - `event_id` (uuid, foreign key to events)
    - `member_id` (uuid, foreign key to members)
    - `response` (text) - Attending, Not Attending, Maybe
    - `responded_at` (timestamptz)
    - `checked_in` (boolean) - Whether member attended
    - `checked_in_at` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

    ### `communications`
    - `id` (uuid, primary key)
    - `type` (text) - SMS, Email, Both
    - `subject` (text) - Email subject or SMS preview
    - `message` (text) - Message content
    - `recipient_filter` (jsonb) - Filter criteria for recipients
    - `recipients_count` (integer) - Number of recipients
    - `sent_count` (integer) - Number successfully sent
    - `failed_count` (integer) - Number failed
    - `status` (text) - Draft, Sending, Sent, Failed
    - `sent_by` (text) - Admin who sent
    - `sent_at` (timestamptz)
    - `created_at` (timestamptz)

    ### `communication_recipients`
    - `id` (uuid, primary key)
    - `communication_id` (uuid, foreign key to communications)
    - `member_id` (uuid, foreign key to members)
    - `status` (text) - Pending, Sent, Failed, Delivered
    - `sent_at` (timestamptz)
    - `delivered_at` (timestamptz)
    - `error_message` (text)
    - `created_at` (timestamptz)

  ## 2. Table Modifications
    - Update membership_cards with expiry tracking fields
    - Add notification preferences to members

  ## 3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for authenticated and anon access

  ## 4. Indexes
    - Add indexes for efficient queries on foreign keys and status fields
*/

-- Create event_rsvps table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  response text DEFAULT 'Maybe',
  responded_at timestamptz DEFAULT now(),
  checked_in boolean DEFAULT false,
  checked_in_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  subject text,
  message text NOT NULL,
  recipient_filter jsonb,
  recipients_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  status text DEFAULT 'Draft',
  sent_by text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create communication_recipients table
CREATE TABLE IF NOT EXISTS communication_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id uuid REFERENCES communications(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'Pending',
  sent_at timestamptz,
  delivered_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Add notification preferences to members table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE members ADD COLUMN notification_preferences jsonb DEFAULT '{"sms": true, "email": true, "push": true}'::jsonb;
  END IF;
END $$;

-- Update membership_cards with expiry tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_cards' AND column_name = 'renewal_reminder_sent'
  ) THEN
    ALTER TABLE membership_cards ADD COLUMN renewal_reminder_sent boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_cards' AND column_name = 'renewal_reminder_sent_at'
  ) THEN
    ALTER TABLE membership_cards ADD COLUMN renewal_reminder_sent_at timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_cards' AND column_name = 'last_renewed_at'
  ) THEN
    ALTER TABLE membership_cards ADD COLUMN last_renewed_at timestamptz;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_member_id ON event_rsvps(member_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_response ON event_rsvps(response);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_checked_in ON event_rsvps(checked_in);

CREATE INDEX IF NOT EXISTS idx_communications_status ON communications(status);
CREATE INDEX IF NOT EXISTS idx_communications_type ON communications(type);
CREATE INDEX IF NOT EXISTS idx_communications_sent_at ON communications(sent_at);

CREATE INDEX IF NOT EXISTS idx_communication_recipients_communication_id ON communication_recipients(communication_id);
CREATE INDEX IF NOT EXISTS idx_communication_recipients_member_id ON communication_recipients(member_id);
CREATE INDEX IF NOT EXISTS idx_communication_recipients_status ON communication_recipients(status);

CREATE INDEX IF NOT EXISTS idx_membership_cards_expiry_date ON membership_cards(expiry_date);
CREATE INDEX IF NOT EXISTS idx_membership_cards_status ON membership_cards(status);

-- Enable Row Level Security
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_recipients ENABLE ROW LEVEL SECURITY;

-- Policies for event_rsvps
CREATE POLICY "Allow anon to view event rsvps"
  ON event_rsvps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view event rsvps"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert event rsvps"
  ON event_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update event rsvps"
  ON event_rsvps FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete event rsvps"
  ON event_rsvps FOR DELETE
  TO authenticated
  USING (true);

-- Policies for communications
CREATE POLICY "Allow anon to view communications"
  ON communications FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view communications"
  ON communications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert communications"
  ON communications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update communications"
  ON communications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete communications"
  ON communications FOR DELETE
  TO authenticated
  USING (true);

-- Policies for communication_recipients
CREATE POLICY "Allow anon to view communication recipients"
  ON communication_recipients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to view communication recipients"
  ON communication_recipients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert communication recipients"
  ON communication_recipients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update communication recipients"
  ON communication_recipients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete communication recipients"
  ON communication_recipients FOR DELETE
  TO authenticated
  USING (true);
