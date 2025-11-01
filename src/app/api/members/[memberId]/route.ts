import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { members, roles } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasAdminPrivileges } from '@/lib/roles';

type MemberUpdate = typeof members.$inferUpdate;

export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params;

    // Fetch member by ID
    const [member] = await db.query.members.findMany({
      where: (member, { eq }) => eq(member.id, memberId),
      with: {
        role: true, // <- loads the related role
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !hasAdminPrivileges(session.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { memberId } = params;
    const body = await request.json();

    const {
      fullName,
      nrcNumber,
      dateOfBirth,
      phone,
      email,
      residentialAddress,
      jurisdiction,
      partyCommitment,
      roleId,
    } = body || {};

    if (
      !fullName?.trim() ||
      !nrcNumber?.trim() ||
      !dateOfBirth ||
      !phone?.trim() ||
      !residentialAddress?.trim() ||
      !jurisdiction ||
      !jurisdiction.province?.trim() ||
      !jurisdiction.district?.trim() ||
      !jurisdiction.constituency?.trim() ||
      !jurisdiction.ward?.trim() ||
      !jurisdiction.branch?.trim() ||
      !jurisdiction.section?.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing required member fields' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(dateOfBirth);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date of birth format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email?.trim() || null;
    const normalizedCommitment = partyCommitment?.trim() || null;
    const normalizedRoleId = roleId === undefined
      ? undefined
      : (roleId ? String(roleId) : null);

    if (normalizedRoleId !== undefined && normalizedRoleId !== null) {
      const roleExists = await db.query.roles.findFirst({
        where: (r, { eq }) => eq(r.id, normalizedRoleId),
        columns: { id: true },
      });

      if (!roleExists) {
        return NextResponse.json(
          { error: 'Specified role does not exist' },
          { status: 400 }
        );
      }
    }

    const updatePayload: MemberUpdate = {
      fullName: fullName.trim(),
      nrcNumber: nrcNumber.trim(),
      dateOfBirth: parsedDate,
      phone: phone.trim(),
      email: normalizedEmail,
      residentialAddress: residentialAddress.trim(),
      province: jurisdiction.province.trim(),
      district: jurisdiction.district.trim(),
      constituency: jurisdiction.constituency.trim(),
      ward: jurisdiction.ward.trim(),
      branch: jurisdiction.branch.trim(),
      section: jurisdiction.section.trim(),
      partyCommitment: normalizedCommitment,
      updatedAt: new Date(),
    };

    if (normalizedRoleId !== undefined) {
      updatePayload.role = normalizedRoleId;
    }

    const [updatedMember] = await db
      .update(members)
      .set(updatePayload)
      .where(eq(members.id, memberId))
      .returning();

    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const memberWithRole = await db.query.members.findFirst({
      where: (m, { eq }) => eq(m.id, memberId),
      with: { role: true },
    });

    if (!memberWithRole) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      member: {
        id: memberWithRole.id,
        membershipId: memberWithRole.membershipId,
        fullName: memberWithRole.fullName,
        nrcNumber: memberWithRole.nrcNumber,
        dateOfBirth:
          typeof memberWithRole.dateOfBirth === 'string'
            ? memberWithRole.dateOfBirth
            : memberWithRole.dateOfBirth?.toISOString().split('T')[0],
        phone: memberWithRole.phone,
        email: memberWithRole.email,
        residentialAddress: memberWithRole.residentialAddress,
        status: memberWithRole.status,
        registrationDate:
          typeof memberWithRole.registrationDate === 'string'
            ? memberWithRole.registrationDate
            : memberWithRole.registrationDate?.toISOString(),
        jurisdiction: {
          province: memberWithRole.province,
          district: memberWithRole.district,
          constituency: memberWithRole.constituency,
          ward: memberWithRole.ward,
          branch: memberWithRole.branch,
          section: memberWithRole.section,
        },
        partyCommitment: memberWithRole.partyCommitment,
        role: memberWithRole.role
          ? { id: memberWithRole.role.id, name: memberWithRole.role.name }
          : null,
        roleId: memberWithRole.role?.id ?? null,
      },
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
