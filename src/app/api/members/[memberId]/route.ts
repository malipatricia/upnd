import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { members } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasAdminPrivileges } from '@/lib/roles';

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

    const [updatedMember] = await db
      .update(members)
      .set({
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
      })
      .where(eq(members.id, memberId))
      .returning();

    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      member: {
        id: updatedMember.id,
        membershipId: updatedMember.membershipId,
        fullName: updatedMember.fullName,
        nrcNumber: updatedMember.nrcNumber,
        dateOfBirth:
          typeof updatedMember.dateOfBirth === 'string'
            ? updatedMember.dateOfBirth
            : updatedMember.dateOfBirth?.toISOString().split('T')[0],
        phone: updatedMember.phone,
        email: updatedMember.email,
        residentialAddress: updatedMember.residentialAddress,
        status: updatedMember.status,
        registrationDate:
          typeof updatedMember.registrationDate === 'string'
            ? updatedMember.registrationDate
            : updatedMember.registrationDate?.toISOString(),
        jurisdiction: {
          province: updatedMember.province,
          district: updatedMember.district,
          constituency: updatedMember.constituency,
          ward: updatedMember.ward,
          branch: updatedMember.branch,
          section: updatedMember.section,
        },
        partyCommitment: updatedMember.partyCommitment,
      },
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
