import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { roles, rolePermissions, permissions, roleRelations, rolePermissionRelations } from '@/drizzle/schema';

// Make sure relations are imported and active
// roleRelations and rolePermissionRelations define how Drizzle should populate nested data

export async function GET(request: NextRequest, context: { params: { role: string } }) {
  const { role } = context.params; // ✅ safe access

  console.log('Fetching permissions for role:', role);

  const [roleRecord] = await db.query.roles.findMany({
    where: eq(roles.name, role),
    with: {
      permissions: {
        with: {
          permission: true,
        },
      },
    },
  });

  if (!roleRecord) {
    return NextResponse.json(
      { error: `Role "${role}" not found`, permissions: [] },
      { status: 404 }
    );
  }

  const permissionNames = roleRecord.permissions
    .map(rp => rp.permission?.name)
    .filter(Boolean);

  console.log('Permissions:', permissionNames);

  return NextResponse.json({ role: roleRecord.name, permissions: permissionNames });
}
