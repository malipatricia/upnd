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
export async function getDashboardStatistics(startDate?: Date, endDate?: Date) {
  try {
    // Build date filter conditions
    const dateFilter = startDate && endDate 
      ? sql`${members.registrationDate} >= ${startDate} AND ${members.registrationDate} <= ${endDate}`
      : sql`1=1`;

    // Get total members count
    const [totalMembersResult] = await db
      .select({ count: count() })
      .from(members)
      .where(dateFilter);

    // Get pending applications count
    const [pendingApplicationsResult] = await db
      .select({ count: count() })
      .from(members)
      .where(sql`${members.status} LIKE 'Pending%' AND ${dateFilter}`);

    // Get approved members count
    const [approvedMembersResult] = await db
      .select({ count: count() })
      .from(members)
      .where(sql`${members.status} = 'Approved' AND ${dateFilter}`);

    // Get active disciplinary cases count
    const disciplinaryDateFilter = startDate && endDate 
      ? sql`${disciplinaryCases.dateReported} >= ${startDate} AND ${disciplinaryCases.dateReported} <= ${endDate}`
      : sql`1=1`;

    const [activeCasesResult] = await db
      .select({ count: count() })
      .from(disciplinaryCases)
      .where(sql`${disciplinaryCases.status} = 'Active' AND ${disciplinaryDateFilter}`);

    // Get provincial distribution
    const provincialDistribution = await db
      .select({
        province: members.province,
        count: count()
      })
      .from(members)
      .where(dateFilter)
      .groupBy(members.province);

    // Get status distribution
    const statusDistribution = await db
      .select({
        status: members.status,
        count: count()
      })
      .from(members)
      .where(dateFilter)
      .groupBy(members.status);

    // Get monthly trends (last 12 months or within date range)
    const monthlyTrends = await db
      .select({
        month: sql<string>`TO_CHAR(${members.registrationDate}, 'Mon')`,
        year: sql<number>`EXTRACT(YEAR FROM ${members.registrationDate})`,
        count: count()
      })
      .from(members)
      .where(startDate && endDate 
        ? dateFilter 
        : sql`${members.registrationDate} >= NOW() - INTERVAL '12 months'`)
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

export async function getAllMembers(startDate?: Date, endDate?: Date) {
  try {
    const dateFilter = startDate && endDate 
      ? sql`${members.registrationDate} >= ${startDate} AND ${members.registrationDate} <= ${endDate}`
      : sql`1=1`;

    const allMembers = await db
      .select()
      .from(members)
      .where(dateFilter)
      .orderBy(members.createdAt);

    return allMembers;
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export async function getDisciplinaryCases(startDate?: Date, endDate?: Date) {
  try {
    const dateFilter = startDate && endDate 
      ? sql`${disciplinaryCases.dateReported} >= ${startDate} AND ${disciplinaryCases.dateReported} <= ${endDate}`
      : sql`1=1`;

    const cases = await db
      .select()
      .from(disciplinaryCases)
      .where(dateFilter)
      .orderBy(disciplinaryCases.createdAt);

    return cases;
  } catch (error) {
    console.error('Error fetching disciplinary cases:', error);
    return [];
  }
}

export async function updateMemberStatus(memberId: string, status: string) {
  try {
    const result = await db
      .update(members)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(members.id, memberId))
      .returning();

    if (result.length === 0) {
      return { error: 'Member not found' };
    }

    return { success: true, member: result[0] };
  } catch (error) {
    console.error('Error updating member status:', error);
    return { error: 'Failed to update member status' };
  }
}

export async function bulkUpdateMemberStatus(memberIds: string[], status: string) {
  try {
    const result = await db
      .update(members)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(sql`${members.id} = ANY(${memberIds})`)
      .returning();

    return { success: true, updatedCount: result.length };
  } catch (error) {
    console.error('Error bulk updating member status:', error);
    return { error: 'Failed to bulk update member status' };
  }
}
