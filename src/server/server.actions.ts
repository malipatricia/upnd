// /server/login.action.ts
"use server";

import { db } from "@/drizzle/db";
import { members, disciplinaryCases } from "@/drizzle/schema";
import { AnyColumn, eq, count, sql } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import { addMemberSchema, loginSchema } from "@/schema/schema";
import z from "zod";

export async function loginAction(
  unsafeData: z.infer<typeof loginSchema>
): Promise<{ error?: string; success?: boolean; user?: any }> {
  const parsed = loginSchema.safeParse(unsafeData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  // Find user by email
  const [user] = await db
    .select()
    .from(members)
    .where(eq(members.email, email.toLowerCase()));

  if (!user) return { error: "Invalid email or password" };

  // Compare password using bcrypt
  const passwordMatch = await compare(password, user.passwordHash || "");
  if (!passwordMatch) return { error: "Invalid email or password" };

  return {
    success: true,
    user: {
      id: user.id,
      name: user.fullName,
      role: user.role,
      email: user.email,
    },
  };
}

export async function exists<T extends keyof typeof members>(
  column: AnyColumn,
  value: string | null
): Promise<boolean> {
  if (value === null) return false;

  const record = await db.query.members.findFirst({
    where: (u, { eq }) => eq(column, value),
    columns: { id: true },
  });

  return !!record;
}

export async function registerMember(formData: unknown) {
  const parsed = addMemberSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;
  const email = data.email?data.email:null
  // first chek unique email
  if (email !== null) {
    try{
    const emailExists = await exists(members.email, email);
    if (emailExists) {
      return {error: 'Email already exists'}
    }}catch{
      return{error: 'Failed: email query'}
    }
  }

  // check nrc uniqueness
  try{const nrcExists = await exists(members.nrcNumber, data.nrcNumber);
  if (nrcExists) {
    return {error: 'NRC already exists'}
  }}catch {
    return {error: 'Failed: nrc query'}
  }
  
        // nrc is unique so post
        // ✅ Use bcrypt to hash the password securely
        const passwordHash = await hash(data.password, 10); // salt rounds = 10

        try {
          await db.insert(members).values({
            ...data,
            passwordHash,
            dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
            email: email
          });

          const id = await db.query.members.findFirst({where: eq(members.nrcNumber, data.nrcNumber)})

          return { success: true, memberId: id?.id};
        } catch (err) {
          console.error("DB insert failed", err);
          return { error: "Registration failed" };
        }
}

// Dashboard statistics functions
export async function getDashboardStatistics() {
  try {
    // Get total members count
    const [totalMembersResult] = await db
      .select({ count: count() })
      .from(members);

    // Get pending applications count
    const [pendingApplicationsResult] = await db
      .select({ count: count() })
      .from(members)
      .where(sql`${members.status} LIKE 'Pending%'`);

    // Get approved members count
    const [approvedMembersResult] = await db
      .select({ count: count() })
      .from(members)
      .where(eq(members.status, 'Approved'));

    // Get active disciplinary cases count
    const [activeCasesResult] = await db
      .select({ count: count() })
      .from(disciplinaryCases)
      .where(eq(disciplinaryCases.status, 'Active'));

    // Get provincial distribution
    const provincialDistribution = await db
      .select({
        province: members.province,
        count: count()
      })
      .from(members)
      .groupBy(members.province);

    // Get status distribution
    const statusDistribution = await db
      .select({
        status: members.status,
        count: count()
      })
      .from(members)
      .groupBy(members.status);

    // Get monthly trends (last 12 months)
    const monthlyTrends = await db
      .select({
        month: sql<string>`TO_CHAR(${members.registrationDate}, 'Mon')`,
        year: sql<number>`EXTRACT(YEAR FROM ${members.registrationDate})`,
        count: count()
      })
      .from(members)
      .where(sql`${members.registrationDate} >= NOW() - INTERVAL '12 months'`)
      .groupBy(sql`TO_CHAR(${members.registrationDate}, 'Mon')`, sql`EXTRACT(YEAR FROM ${members.registrationDate})`)
      .orderBy(sql`EXTRACT(YEAR FROM ${members.registrationDate})`, sql`TO_CHAR(${members.registrationDate}, 'Mon')`);

    // Convert to the expected format
    const provincialDistributionObj: Record<string, number> = {};
    provincialDistribution.forEach(item => {
      provincialDistributionObj[item.province] = item.count;
    });

    const statusDistributionObj: Record<string, number> = {};
    statusDistribution.forEach(item => {
      statusDistributionObj[item.status || 'Unknown'] = item.count;
    });

    const monthlyTrendsArray = monthlyTrends.map(item => ({
      month: item.month,
      registrations: item.count
    }));

    return {
      totalMembers: totalMembersResult.count,
      pendingApplications: pendingApplicationsResult.count,
      approvedMembers: approvedMembersResult.count,
      activeCases: activeCasesResult.count,
      provincialDistribution: provincialDistributionObj,
      monthlyTrends: monthlyTrendsArray,
      statusDistribution: statusDistributionObj
    };
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return {
      totalMembers: 0,
      pendingApplications: 0,
      approvedMembers: 0,
      activeCases: 0,
      provincialDistribution: {},
      monthlyTrends: [],
      statusDistribution: {}
    };
  }
}

export async function getAllMembers() {
  try {
    const allMembers = await db
      .select()
      .from(members)
      .orderBy(members.createdAt);

    return allMembers;
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export async function getDisciplinaryCases() {
  try {
    const cases = await db
      .select()
      .from(disciplinaryCases)
      .orderBy(disciplinaryCases.createdAt);

    return cases;
  } catch (error) {
    console.error('Error fetching disciplinary cases:', error);
    return [];
  }
}
