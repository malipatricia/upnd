// /schema/loginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
});

export const jurisdictionSchema = z.object({
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  constituency: z.string().min(1, "Constituency is required"),
  ward: z.string().min(1, "Ward is required"),
  branch: z.string().min(1, "Branch is required"),
  section: z.string().min(1, "Section is required"),
})

export const endorsementSchema = z.object({
  endorserName: z.string().optional(),
  membershipId: z.string().optional(),
  endorsementDate: z.date().optional(),
})

export const addMemberSchema = z
  .object({
  // Auth.js-required fields
  email: z.string().optional(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().url().nullable().optional(),

  // Auth extension
  password: z.string(),
  confirmPassword: z.string(),
  isVerified: z.boolean().default(false).optional(),
  role: z.string(),
  lastLoginAt: z.date().nullable().optional(),

  // Core membership fields
  membershipId: z.string().min(1),
  fullName: z.string().min(2),
  nrcNumber: z.string().regex(/^\d{6}\/\d{2}\/\d$/, "Invalid NRC format"),
  dateOfBirth: z.date().refine((value) => {
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      const monthDiff = today.getMonth() - value.getMonth();
      const dayDiff = today.getDate() - value.getDate();

      // Adjust for birthdays not yet reached this year
      const is18OrOlder =
        age > 18 ||
        (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      return is18OrOlder;
    }, "You must be at least 18 years old to register"),
  gender: z.string().default("Male").optional(),
  phone: z.string().regex(/^\+260\d{9}$/, 'Should start with +260, atleast 12 digits').min(12),
  residentialAddress: z.string().min(1),

  latitude: z
    .union([
      z.coerce
        .string()
        .regex(/^[-+]?([1-8]?\d(\.\d{1,8})?|90(\.0{1,8})?)$/, "Invalid latitude"),
      z.null(),
    ])
    .optional(),

  longitude: z
    .union([
      z.coerce
        .string()
        .regex(/^[-+]?([1-8]?\d(\.\d{1,8})?|90(\.0{1,8})?)$/, "Invalid latitude"),
      z.null(),
    ])
    .optional(),

  province: z.string().min(1),
  district: z.string().min(1),
  constituency: z.string().min(1),
  ward: z.string().min(1),
  branch: z.string().min(1),
  section: z.string().min(1),

  education: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),

  membershipLevel: z.string().default("General").optional(),
  partyRole: z.string().optional().nullable(),
  partyCommitment: z.string().optional().nullable(),

  profileImage: z.string().url().optional().nullable(),
  registrationDate: z.date().optional(),
  userId: z.string().optional(),
  endorsements: z.array(endorsementSchema).optional(),
  acceptConstitution: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the UPND Constitution to proceed",
    }),

  notificationPreferences: z
    .object({
      sms: z.boolean().default(true),
      push: z.boolean().default(true),
      email: z.boolean().default(true),
    })
    .optional(),
  }).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

  // Province
export const provinceSchema = z.object({
  name: z.string().min(1, "Province name is required"),
});

// District
export const districtSchema = z.object({
  name: z.string().min(1, "District name is required"),
  provinceId: z.string().uuid("Invalid province ID"),
});

export const settingsSchema = z.object({
  platformName: z.string().min(1),
  partyName: z.string().min(1),
  partyMotto: z.string().min(1),
  supportEmail: z.string().email(),
  supportPhone: z.string().min(1),
});

export const updateMemberSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  confirmpassword: z.string().optional()
}).superRefine(({ confirmpassword, password }, ctx) => {
    if (confirmpassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });