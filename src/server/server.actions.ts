// /server/login.action.ts
"use server";

import { db } from "@/drizzle/db";
import { members, disciplinaryCases, roles, permissions, rolePermissions, provinces, districts } from "@/drizzle/schema";
import { AnyColumn, eq, count, sql, and, gte, lte, like } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import { addMemberSchema, districtSchema, loginSchema, provinceSchema } from "@/schema/schema";
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
    .query
    .members
    .findMany({where: eq(members.email, email.toLowerCase()),with: {role: true}});

  if (!user) return { error: "Invalid email or password" };

  // Compare password using bcrypt
  const passwordMatch = await compare(password, user.passwordHash || "");
  if (!passwordMatch) return { error: "Invalid email or password" };

  return {
    success: true,
    user: {
      id: user.id,
      name: user.fullName,
      role: user.role?.name,
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
  function toPgDate(date: Date) {
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }

  try {
    // Build date filters
    const memberDateFilter = startDate && endDate
      ? and(
          gte(members.registrationDate, startDate),
          lte(members.registrationDate, endDate)
        )
      : undefined;

    const disciplinaryDateFilter = startDate && endDate
      ? and(
          gte(disciplinaryCases.dateReported, toPgDate(startDate)),
          lte(disciplinaryCases.dateReported, toPgDate(endDate))
        )
      : undefined;

    // Total members
    const [totalMembersResult] = await db.select({ total: count() })
      .from(members)
      .where(memberDateFilter);


    // Pending applications
    const [pendingApplicationsResult] = await db.select({ total: count() })
      .from(members)
      .where(and(
        like(sql`${members.status}::text`, 'Pending%'),
        ...(memberDateFilter ? [memberDateFilter] : [])
      ));

    // Approved members
    const [approvedMembersResult] = await db.select({ total: count() })
      .from(members)
      .where(and(
        like(sql`${members.status}::text`, 'Approved%'),
        ...(memberDateFilter ? [memberDateFilter] : [])
      ));

    // Active disciplinary cases
    const [activeCasesResult] = await db.select({ total: count() })
      .from(disciplinaryCases)
      .where(and(
        eq(disciplinaryCases.status, "Active"),
        ...(disciplinaryDateFilter ? [disciplinaryDateFilter] : [])
      ));

    // Provincial distribution
    const provincialDistribution = await db
      .select({
        province: members.province,
        count: count()
      })
      .from(members)
      .where(memberDateFilter)
      .groupBy(members.province);

    // Status distribution
    const statusDistribution = await db
      .select({
        status: members.status,
        count: count()
      })
      .from(members)
      .where(memberDateFilter)
      .groupBy(members.status);

    // Monthly trends (last 12 months or within date range)
    const monthlyTrends = await db
      .select({
        month: sql<string>`TO_CHAR(${members.registrationDate}, 'Mon')`,
        year: sql<number>`EXTRACT(YEAR FROM ${members.registrationDate})`,
        count: count()
      })
      .from(members)
      .where(startDate && endDate 
        ? memberDateFilter 
        : sql`${members.registrationDate} >= NOW() - INTERVAL '12 months'`)
      .groupBy(sql`TO_CHAR(${members.registrationDate}, 'Mon')`, sql`EXTRACT(YEAR FROM ${members.registrationDate})`)
      .orderBy(sql`EXTRACT(YEAR FROM ${members.registrationDate})`, sql`TO_CHAR(${members.registrationDate}, 'Mon')`);

    // Convert distributions
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
      totalMembers: totalMembersResult?.total ?? 0,
      pendingApplications: pendingApplicationsResult?.total ?? 0,
      approvedMembers: approvedMembersResult?.total ?? 0,
      activeCases: activeCasesResult?.total ?? 0,
      rejectedApplications: 0,
      suspendedMembers: 0,
      provincialDistribution: provincialDistributionObj,
      statusDistribution: statusDistributionObj,
      monthlyTrends: monthlyTrendsArray
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return {
      totalMembers: 0,
      pendingApplications: 0,
      approvedMembers: 0,
      activeCases: 0,
      rejectedApplications: 0,
      suspendedMembers: 0,
      provincialDistribution: {},
      statusDistribution: {},
      monthlyTrends: []
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

import { MembershipStatus } from '../types'; // wherever you define it

export async function updateMemberStatus(memberId: string, status: MembershipStatus) {
  try {
    const result = await db
      .update(members)
      .set({ 
        status, // ✅ now matches the enum type
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


export async function bulkUpdateMemberStatus(memberIds: string[], status: MembershipStatus) {
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
// Add a new Role
export async function addRoleAction(
  name: string,
  description?: string,
  permissionIds: string[] = []
): Promise<{ id: string; name: string; description: string | null } | { error: string }> {
  if (!name.trim()) return { error: 'Role name is required' };

  try {
    const [role] = await db.insert(roles)
      .values({ name, description: description ?? null })
      .returning({ id: roles.id, name: roles.name, description: roles.description });

    if (!role) return { error: 'Failed to insert role' };

    if (permissionIds.length > 0) {
      const values = permissionIds.map(permissionId => ({
        roleId: role.id,
        permissionId,
      }));
      await db.insert(rolePermissions).values(values);
    }

    return role;
  } catch (err: any) {
    if (err.cause?.code === '23505') return { error: `Role "${name}" already exists.` };
    return { error: err.message || 'Failed to add role' };
  }
}


export async function addPermissionAction(
  name: string,
  description?: string,
  roleIds: string[] = []
) {
  if (!name.trim()) throw new Error('Permission name is required');

  try {
    const result = await db.transaction(async (tx) => {
      // 1️⃣ Insert permission
      const [permission] = await tx.insert(permissions)
        .values({ name, description: description ?? null })
        .returning({ id: permissions.id, name: permissions.name });

      if (!permission) throw new Error('Failed to insert permission');

      // 2️⃣ Insert role-permission links if any
      if (roleIds.length > 0) {
        const values = roleIds.map((roleId) => ({
          roleId,
          permissionId: permission.id as string,
        }));

        await tx.insert(rolePermissions).values(values);
      }

      return permission;
    });

    return result;

  } catch (err: any) {
    // Keep the Postgres unique violation check
    if (err?.cause?.code === '23505') {
      return { error: `Permission "${name}" already exists.` };
    }

    if (err) {
      return { error: err };
    }

    console.error('Error adding permission:', err);
    return { error: err?.message || 'Failed to add permission' };
  }
}
export async function getMemberRolesAndPermissions(memberId: string) {
  // 1. Get the member along with their role
  const [memberWithRole] = await db
    .select({
      id: members.id,
      email: members.email,
      roleId: roles.id,
      roleName: roles.name,
    })
    .from(members)
    .leftJoin(roles, eq(members.role, roles.id))
    .where(eq(members.id, memberId));

  if (!memberWithRole || !memberWithRole.roleId) {
    return { roles: [], permissions: [] };
  }

  // 2. Fetch permissions for this role
  const permissionRows = await db
    .select({ id: permissions.id, name: permissions.name })
    .from(permissions)
    .innerJoin(rolePermissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, memberWithRole.roleId));

    console.log(permissions)

  return {
    roles: [memberWithRole.roleName],
    permissions: permissionRows.map(p => p.name),
  };
}
export async function updateRolePermissionsAction(roleId: string, permissionIds: string[]) {
  try {
    // Remove all existing permissions for the role
      await db
    .delete(rolePermissions)
    .where(eq(rolePermissions.roleId, roleId));

    // Insert new permissions
    if (permissionIds.length > 0) {
      await db.insert(rolePermissions).values(
        permissionIds.map(pid => ({ roleId, permissionId: pid }))
      );
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update role permissions" };
  }
}

// --- Province ---
export async function addProvinceAction(name: string) {
  provinceSchema.parse({ name });
  await db.insert(provinces).values({ name });
}

export async function deleteProvinceAction(id: string) {
  if (!id) throw new Error("Province ID is required");
  await db.delete(provinces).where(eq(provinces.id, id));
}

// --- District ---
export async function addDistrictAction(name: string, provinceId: string) {
  districtSchema.parse({ name, provinceId });
  await db.insert(districts).values({ name, provinceId });
}

export async function deleteDistrictAction(id: string) {
  if (!id) throw new Error("District ID is required");
  await db.delete(districts).where(eq(districts.id, id));
}