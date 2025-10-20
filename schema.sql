--
-- PostgreSQL database dump
--

\restrict 0R1Jn9IyDFEofWBr1AG4Pne0trklMstNhgf3SiOVlIQ41TyNJ4ipeKZsdRNjasn

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: communication_recipients; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.communication_recipients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    communication_id uuid NOT NULL,
    member_id uuid NOT NULL,
    status text DEFAULT 'Pending'::text,
    sent_at timestamp with time zone,
    delivered_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.communication_recipients OWNER TO devmac;

--
-- Name: communications; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.communications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    subject text,
    message text NOT NULL,
    recipient_filter jsonb,
    recipients_count integer DEFAULT 0,
    sent_count integer DEFAULT 0,
    failed_count integer DEFAULT 0,
    status text DEFAULT 'Draft'::text,
    sent_by text,
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.communications OWNER TO devmac;

--
-- Name: disciplinary_cases; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.disciplinary_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_number text NOT NULL,
    member_id uuid,
    violation_type text NOT NULL,
    description text NOT NULL,
    severity text DEFAULT 'Medium'::text,
    status text DEFAULT 'Active'::text,
    date_reported date DEFAULT CURRENT_DATE,
    date_incident date,
    reporting_officer text NOT NULL,
    assigned_officer text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.disciplinary_cases OWNER TO devmac;

--
-- Name: event_rsvps; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.event_rsvps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    member_id uuid NOT NULL,
    response text DEFAULT 'Maybe'::text,
    responded_at timestamp with time zone DEFAULT now(),
    checked_in boolean DEFAULT false,
    checked_in_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.event_rsvps OWNER TO devmac;

--
-- Name: events; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_name text NOT NULL,
    event_type text NOT NULL,
    description text,
    event_date date NOT NULL,
    event_time time without time zone,
    location text NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    province text,
    district text,
    organizer text NOT NULL,
    expected_attendees integer DEFAULT 0,
    actual_attendees integer DEFAULT 0,
    status text DEFAULT 'Planned'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.events OWNER TO devmac;

--
-- Name: members; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    membership_id text NOT NULL,
    full_name text NOT NULL,
    nrc_number text NOT NULL,
    date_of_birth date NOT NULL,
    gender text DEFAULT 'Male'::text,
    phone text NOT NULL,
    email text,
    residential_address text NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    province text NOT NULL,
    district text NOT NULL,
    constituency text NOT NULL,
    ward text NOT NULL,
    branch text NOT NULL,
    section text NOT NULL,
    education text,
    occupation text,
    skills text[],
    membership_level text DEFAULT 'General'::text,
    party_role text,
    party_commitment text,
    status text DEFAULT 'Pending Section Review'::text,
    profile_image text,
    registration_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    notification_preferences jsonb DEFAULT '{"sms": true, "push": true, "email": true}'::jsonb
);


ALTER TABLE public.members OWNER TO devmac;

--
-- Name: membership_cards; Type: TABLE; Schema: public; Owner: devmac
--

CREATE TABLE public.membership_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    member_id uuid,
    card_type text DEFAULT 'Standard'::text,
    issue_date date DEFAULT CURRENT_DATE,
    expiry_date date,
    qr_code text,
    status text DEFAULT 'Active'::text,
    created_at timestamp with time zone DEFAULT now(),
    renewal_reminder_sent boolean DEFAULT false,
    renewal_reminder_sent_at timestamp with time zone,
    last_renewed_at timestamp with time zone
);


ALTER TABLE public.membership_cards OWNER TO devmac;

--
-- Name: communication_recipients communication_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT communication_recipients_pkey PRIMARY KEY (id);


--
-- Name: communications communications_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_pkey PRIMARY KEY (id);


--
-- Name: disciplinary_cases disciplinary_cases_case_number_key; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.disciplinary_cases
    ADD CONSTRAINT disciplinary_cases_case_number_key UNIQUE (case_number);


--
-- Name: disciplinary_cases disciplinary_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.disciplinary_cases
    ADD CONSTRAINT disciplinary_cases_pkey PRIMARY KEY (id);


--
-- Name: event_rsvps event_rsvps_event_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.event_rsvps
    ADD CONSTRAINT event_rsvps_event_id_member_id_key UNIQUE (event_id, member_id);


--
-- Name: event_rsvps event_rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.event_rsvps
    ADD CONSTRAINT event_rsvps_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: members members_membership_id_key; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_membership_id_key UNIQUE (membership_id);


--
-- Name: members members_nrc_number_key; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_nrc_number_key UNIQUE (nrc_number);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: membership_cards membership_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.membership_cards
    ADD CONSTRAINT membership_cards_pkey PRIMARY KEY (id);


--
-- Name: idx_communication_recipients_communication_id; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_communication_recipients_communication_id ON public.communication_recipients USING btree (communication_id);


--
-- Name: idx_communication_recipients_member_id; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_communication_recipients_member_id ON public.communication_recipients USING btree (member_id);


--
-- Name: idx_communication_recipients_status; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_communication_recipients_status ON public.communication_recipients USING btree (status);


--
-- Name: idx_communications_sent_at; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_communications_sent_at ON public.communications USING btree (sent_at);


--
-- Name: idx_communications_status; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_communications_status ON public.communications USING btree (status);


--
-- Name: idx_communications_type; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_communications_type ON public.communications USING btree (type);


--
-- Name: idx_disciplinary_cases_member_id; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_disciplinary_cases_member_id ON public.disciplinary_cases USING btree (member_id);


--
-- Name: idx_disciplinary_cases_status; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_disciplinary_cases_status ON public.disciplinary_cases USING btree (status);


--
-- Name: idx_event_rsvps_checked_in; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_event_rsvps_checked_in ON public.event_rsvps USING btree (checked_in);


--
-- Name: idx_event_rsvps_event_id; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_event_rsvps_event_id ON public.event_rsvps USING btree (event_id);


--
-- Name: idx_event_rsvps_member_id; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_event_rsvps_member_id ON public.event_rsvps USING btree (member_id);


--
-- Name: idx_event_rsvps_response; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_event_rsvps_response ON public.event_rsvps USING btree (response);


--
-- Name: idx_events_date; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_events_date ON public.events USING btree (event_date);


--
-- Name: idx_events_geolocation; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_events_geolocation ON public.events USING btree (latitude, longitude);


--
-- Name: idx_events_province; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_events_province ON public.events USING btree (province);


--
-- Name: idx_members_constituency; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_members_constituency ON public.members USING btree (constituency);


--
-- Name: idx_members_district; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_members_district ON public.members USING btree (district);


--
-- Name: idx_members_geolocation; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_members_geolocation ON public.members USING btree (latitude, longitude);


--
-- Name: idx_members_membership_level; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_members_membership_level ON public.members USING btree (membership_level);


--
-- Name: idx_members_province; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_members_province ON public.members USING btree (province);


--
-- Name: idx_members_status; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_members_status ON public.members USING btree (status);


--
-- Name: idx_membership_cards_expiry_date; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_membership_cards_expiry_date ON public.membership_cards USING btree (expiry_date);


--
-- Name: idx_membership_cards_member_id; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_membership_cards_member_id ON public.membership_cards USING btree (member_id);


--
-- Name: idx_membership_cards_status; Type: INDEX; Schema: public; Owner: devmac
--

CREATE INDEX idx_membership_cards_status ON public.membership_cards USING btree (status);


--
-- Name: communication_recipients communication_recipients_communication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT communication_recipients_communication_id_fkey FOREIGN KEY (communication_id) REFERENCES public.communications(id) ON DELETE CASCADE;


--
-- Name: communication_recipients communication_recipients_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT communication_recipients_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE;


--
-- Name: disciplinary_cases disciplinary_cases_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.disciplinary_cases
    ADD CONSTRAINT disciplinary_cases_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE;


--
-- Name: event_rsvps event_rsvps_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.event_rsvps
    ADD CONSTRAINT event_rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_rsvps event_rsvps_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.event_rsvps
    ADD CONSTRAINT event_rsvps_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE;


--
-- Name: membership_cards membership_cards_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devmac
--

ALTER TABLE ONLY public.membership_cards
    ADD CONSTRAINT membership_cards_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE;


--
-- Name: communication_recipients Allow anon to view communication recipients; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view communication recipients" ON public.communication_recipients FOR SELECT TO anon USING (true);


--
-- Name: communications Allow anon to view communications; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view communications" ON public.communications FOR SELECT TO anon USING (true);


--
-- Name: disciplinary_cases Allow anon to view disciplinary cases; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view disciplinary cases" ON public.disciplinary_cases FOR SELECT TO anon USING (true);


--
-- Name: event_rsvps Allow anon to view event rsvps; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view event rsvps" ON public.event_rsvps FOR SELECT TO anon USING (true);


--
-- Name: events Allow anon to view events; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view events" ON public.events FOR SELECT TO anon USING (true);


--
-- Name: members Allow anon to view members; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view members" ON public.members FOR SELECT TO anon USING (true);


--
-- Name: membership_cards Allow anon to view membership cards; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow anon to view membership cards" ON public.membership_cards FOR SELECT TO anon USING (true);


--
-- Name: communication_recipients Allow authenticated to delete communication recipients; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete communication recipients" ON public.communication_recipients FOR DELETE TO authenticated USING (true);


--
-- Name: communications Allow authenticated to delete communications; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete communications" ON public.communications FOR DELETE TO authenticated USING (true);


--
-- Name: disciplinary_cases Allow authenticated to delete disciplinary cases; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete disciplinary cases" ON public.disciplinary_cases FOR DELETE TO authenticated USING (true);


--
-- Name: event_rsvps Allow authenticated to delete event rsvps; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete event rsvps" ON public.event_rsvps FOR DELETE TO authenticated USING (true);


--
-- Name: events Allow authenticated to delete events; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete events" ON public.events FOR DELETE TO authenticated USING (true);


--
-- Name: members Allow authenticated to delete members; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete members" ON public.members FOR DELETE TO authenticated USING (true);


--
-- Name: membership_cards Allow authenticated to delete membership cards; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to delete membership cards" ON public.membership_cards FOR DELETE TO authenticated USING (true);


--
-- Name: communication_recipients Allow authenticated to insert communication recipients; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert communication recipients" ON public.communication_recipients FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: communications Allow authenticated to insert communications; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert communications" ON public.communications FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: disciplinary_cases Allow authenticated to insert disciplinary cases; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert disciplinary cases" ON public.disciplinary_cases FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: event_rsvps Allow authenticated to insert event rsvps; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert event rsvps" ON public.event_rsvps FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: events Allow authenticated to insert events; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: members Allow authenticated to insert members; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: membership_cards Allow authenticated to insert membership cards; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to insert membership cards" ON public.membership_cards FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: communication_recipients Allow authenticated to update communication recipients; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update communication recipients" ON public.communication_recipients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: communications Allow authenticated to update communications; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update communications" ON public.communications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: disciplinary_cases Allow authenticated to update disciplinary cases; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update disciplinary cases" ON public.disciplinary_cases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: event_rsvps Allow authenticated to update event rsvps; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update event rsvps" ON public.event_rsvps FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: events Allow authenticated to update events; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update events" ON public.events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: members Allow authenticated to update members; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update members" ON public.members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: membership_cards Allow authenticated to update membership cards; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to update membership cards" ON public.membership_cards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- Name: communication_recipients Allow authenticated to view communication recipients; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view communication recipients" ON public.communication_recipients FOR SELECT TO authenticated USING (true);


--
-- Name: communications Allow authenticated to view communications; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view communications" ON public.communications FOR SELECT TO authenticated USING (true);


--
-- Name: disciplinary_cases Allow authenticated to view disciplinary cases; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view disciplinary cases" ON public.disciplinary_cases FOR SELECT TO authenticated USING (true);


--
-- Name: event_rsvps Allow authenticated to view event rsvps; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view event rsvps" ON public.event_rsvps FOR SELECT TO authenticated USING (true);


--
-- Name: events Allow authenticated to view events; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view events" ON public.events FOR SELECT TO authenticated USING (true);


--
-- Name: members Allow authenticated to view members; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view members" ON public.members FOR SELECT TO authenticated USING (true);


--
-- Name: membership_cards Allow authenticated to view membership cards; Type: POLICY; Schema: public; Owner: devmac
--

CREATE POLICY "Allow authenticated to view membership cards" ON public.membership_cards FOR SELECT TO authenticated USING (true);


--
-- Name: communication_recipients; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.communication_recipients ENABLE ROW LEVEL SECURITY;

--
-- Name: communications; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

--
-- Name: disciplinary_cases; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.disciplinary_cases ENABLE ROW LEVEL SECURITY;

--
-- Name: event_rsvps; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: members; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

--
-- Name: membership_cards; Type: ROW SECURITY; Schema: public; Owner: devmac
--

ALTER TABLE public.membership_cards ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 0R1Jn9IyDFEofWBr1AG4Pne0trklMstNhgf3SiOVlIQ41TyNJ4ipeKZsdRNjasn

