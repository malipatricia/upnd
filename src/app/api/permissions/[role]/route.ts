import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { roles } from '@/drizzle/schema';

export async function GET(
  request: NextRequest,
  context: { params: { role: string } }
) {
  // ✅ Await params if needed
  const params = await context.params;  // <-- this fixes the Next warning
  const { role } = params;

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
    return NextResponse.json({ error: `Role "${role}" not found` }, { status: 404 });
  }

  const permissionNames = roleRecord.permissions.map(rp => rp.permission?.name).filter(Boolean);

  return NextResponse.json({ role: roleRecord.name, permissions: permissionNames });
}
