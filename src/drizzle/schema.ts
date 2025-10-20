import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  numeric,
  boolean,
  timestamp,
  date,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ===== MEMBERS =====
export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  membershipId: text("membership_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  nrcNumber: text("nrc_number").notNull().unique(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").default("Male"),
  phone: text("phone").notNull(),
  email: text("email"),
  residentialAddress: text("residential_address").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  province: text("province").notNull(),
  district: text("district").notNull(),
  constituency: text("constituency").notNull(),
  ward: text("ward").notNull(),
  branch: text("branch").notNull(),
  section: text("section").notNull(),
  education: text("education"),
  occupation: text("occupation"),
  skills: text("skills").array(),
  membershipLevel: text("membership_level").default("General"),
  partyRole: text("party_role"),
  partyCommitment: text("party_commitment"),
  status: text("status").default("Pending Section Review"),
  profileImage: text("profile_image"),
  registrationDate: timestamp("registration_date", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  notificationPreferences: jsonb("notification_preferences").default({
    sms: true,
    push: true,
    email: true,
  }),
});

// ===== MEMBERSHIP CARDS =====
export const membershipCards = pgTable("membership_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: uuid("member_id").references(() => members.id, { onDelete: "cascade" }),
  cardType: text("card_type").default("Standard"),
  issueDate: date("issue_date").defaultNow(),
  expiryDate: date("expiry_date"),
  qrCode: text("qr_code"),
  status: text("status").default("Active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  renewalReminderSent: boolean("renewal_reminder_sent").default(false),
  renewalReminderSentAt: timestamp("renewal_reminder_sent_at", { withTimezone: true }),
  lastRenewedAt: timestamp("last_renewed_at", { withTimezone: true }),
});

// ===== EVENTS =====
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventName: text("event_name").notNull(),
  eventType: text("event_type").notNull(),
  description: text("description"),
  eventDate: date("event_date").notNull(),
  eventTime: text("event_time"),
  location: text("location").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  province: text("province"),
  district: text("district"),
  organizer: text("organizer").notNull(),
  expectedAttendees: integer("expected_attendees").default(0),
  actualAttendees: integer("actual_attendees").default(0),
  status: text("status").default("Planned"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ===== EVENT RSVPS =====
export const eventRsvps = pgTable(
  "event_rsvps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    response: text("response").default("Maybe"),
    respondedAt: timestamp("responded_at", { withTimezone: true }).defaultNow(),
    checkedIn: boolean("checked_in").default(false),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueEventMember: uniqueIndex("event_rsvps_event_id_member_id_key").on(
      table.eventId,
      table.memberId
    ),
  })
);

// ===== COMMUNICATIONS =====
export const communications = pgTable("communications", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  recipientFilter: jsonb("recipient_filter"),
  recipientsCount: integer("recipients_count").default(0),
  sentCount: integer("sent_count").default(0),
  failedCount: integer("failed_count").default(0),
  status: text("status").default("Draft"),
  sentBy: text("sent_by"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ===== COMMUNICATION RECIPIENTS =====
export const communicationRecipients = pgTable("communication_recipients", {
  id: uuid("id").defaultRandom().primaryKey(),
  communicationId: uuid("communication_id")
    .notNull()
    .references(() => communications.id, { onDelete: "cascade" }),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  status: text("status").default("Pending"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ===== DISCIPLINARY CASES =====
export const disciplinaryCases = pgTable("disciplinary_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  memberId: uuid("member_id").references(() => members.id, { onDelete: "cascade" }),
  violationType: text("violation_type").notNull(),
  description: text("description").notNull(),
  severity: text("severity").default("Medium"),
  status: text("status").default("Active"),
  dateReported: date("date_reported").defaultNow(),
  dateIncident: date("date_incident"),
  reportingOfficer: text("reporting_officer").notNull(),
  assignedOfficer: text("assigned_officer"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ===== RELATIONS =====
export const membersRelations = relations(members, ({ many }) => ({
  membershipCards: many(membershipCards),
  eventRsvps: many(eventRsvps),
  disciplinaryCases: many(disciplinaryCases),
  communicationRecipients: many(communicationRecipients),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  rsvps: many(eventRsvps),
}));

export const communicationsRelations = relations(communications, ({ many }) => ({
  recipients: many(communicationRecipients),
}));

export const eventRsvpsRelations = relations(eventRsvps, ({ one }) => ({
  event: one(events, {
    fields: [eventRsvps.eventId],
    references: [events.id],
  }),
  member: one(members, {
    fields: [eventRsvps.memberId],
    references: [members.id],
  }),
}));

export const membershipCardsRelations = relations(membershipCards, ({ one }) => ({
  member: one(members, {
    fields: [membershipCards.memberId],
    references: [members.id],
  }),
}));

export const disciplinaryCasesRelations = relations(disciplinaryCases, ({ one }) => ({
  member: one(members, {
    fields: [disciplinaryCases.memberId],
    references: [members.id],
  }),
}));

export const communicationRecipientsRelations = relations(communicationRecipients, ({ one }) => ({
  communication: one(communications, {
    fields: [communicationRecipients.communicationId],
    references: [communications.id],
  }),
  member: one(members, {
    fields: [communicationRecipients.memberId],
    references: [members.id],
  }),
}));
