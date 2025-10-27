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
const createdAt = timestamp('created_at').notNull().defaultNow()
const updatedAt = timestamp('updated_at')
  .$onUpdate(() => new Date())

// --- MEMBERS (used as users table) ---
export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Auth.js-required fields:
  email: text("email").unique(), // required by Auth.js
  emailVerified: timestamp("email_verified", ),
  image: text("image"), // maps from profileImage

  // Auth extension
  passwordHash: text("password_hash").notNull().unique(), // for credentials provider
  isVerified: boolean("is_verified").default(false),
  role: text("role").default("member").$type<'admin' | 'member' | 'sectionadmin' | 'branchadmin' | 'wardadmin' | 'districtadmin' | 'provinceadmin'>(),
  lastLoginAt: timestamp("last_login_at", ),

  // Existing fields (still included)
  membershipId: text("membership_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  nrcNumber: text("nrc_number").notNull().unique(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").default("Male"),
  phone: text("phone").notNull(),
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
  status: text("status").default("Pending Section Review").$type<'Pending Section Review' | 'Pending Branch Review' | 'Pending Ward Review' | 'Pending District Review' | 'Pending Provincial Review' | 'Approved' | 'Rejected' | 'Suspended' | 'Expelled'>(),

  profileImage: text("profile_image"),
  registrationDate: timestamp("registration_date", ).defaultNow(),
  createdAt,
  updatedAt,
  
  notificationPreferences: jsonb("notification_preferences").default({
    sms: true,
    push: true,
    email: true,
  }),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});


// ===== ACCOUNTS (for OAuth logins, optional) =====
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),

    type: text("type").notNull(), // "oauth", "oidc", "email", etc.
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  }
);

// Roles table
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
});

// Permissions table
export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
});

// Role–Permission many-to-many join table
export const rolePermissions = pgTable("role_permissions", {
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id).notNull(),
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
  createdAt,
  updatedAt,
  renewalReminderSent: boolean("renewal_reminder_sent").default(false),
  renewalReminderSentAt: timestamp("renewal_reminder_sent_at", ),
  lastRenewedAt: timestamp("last_renewed_at", ),
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
  createdAt,
  updatedAt,
});

// ===== EVENT RSVPS =====
export const eventRsvps = pgTable(
  "event_rsvps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    response: text("response").default("Maybe"),
    respondedAt: timestamp("responded_at", ).defaultNow(),
    checkedIn: boolean("checked_in").default(false),
    checkedInAt: timestamp("checked_in_at", ),
    notes: text("notes"),
  createdAt,
  updatedAt,
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
  sentAt: timestamp("sent_at", ),
  createdAt,
  updatedAt,
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
  sentAt: timestamp("sent_at", ),
  deliveredAt: timestamp("delivered_at", ),
  errorMessage: text("error_message"),
  createdAt,
  updatedAt,
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
  createdAt,
  updatedAt,
});
// --- PROVINCES ---
export const provinces = pgTable("provinces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt,
  updatedAt,
});


// --- DISTRICTS ---
export const districts = pgTable("districts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  provinceId: uuid("province_id")
    .notNull()
    .references(() => provinces.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});


// --- VIOLATION TYPES ---
export const violationTypes = pgTable("violation_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt,
  updatedAt,
});


// --- UPND POSITIONS ---
export const upndPositions = pgTable("upnd_positions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  level: text("level"), // optional: National, Provincial, etc.
  createdAt,
  updatedAt,
});


// --- POLICY AREAS ---
export const policyAreas = pgTable("policy_areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt,
  updatedAt,
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

// Relation (Province → Districts)
export const provinceRelations = relations(provinces, ({ many }) => ({
  districts: many(districts),
}));

// Relation (District → Province)
export const districtRelations = relations(districts, ({ one }) => ({
  province: one(provinces, {
    fields: [districts.provinceId],
    references: [provinces.id],
  }),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
}));

export const permissionRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissionRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
