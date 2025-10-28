import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/drizzle/db';
import { members } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
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
      partyCommitment
    } = body;

    // Validate required fields
    if (!fullName || !nrcNumber || !dateOfBirth || !phone || !residentialAddress || !jurisdiction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if member exists
    const [existingMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId));

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if NRC number is already taken by another member
    if (nrcNumber !== existingMember.nrcNumber) {
      const [existingNrc] = await db
        .select()
        .from(members)
        .where(eq(members.nrcNumber, nrcNumber));

      if (existingNrc) {
        return NextResponse.json(
          { error: 'NRC number already exists for another member' },
          { status: 400 }
        );
      }
    }

    // Update member
    const [updatedMember] = await db
      .update(members)
      .set({
        fullName,
        nrcNumber,
        dateOfBirth,
        phone,
        email: email || null,
        residentialAddress,
        province: jurisdiction.province,
        district: jurisdiction.district,
        constituency: jurisdiction.constituency,
        ward: jurisdiction.ward,
        branch: jurisdiction.branch,
        section: jurisdiction.section,
        partyCommitment: partyCommitment || null,
        updatedAt: new Date()
      })
      .where(eq(members.id, memberId))
      .returning();

    return NextResponse.json({
      success: true,
      member: {
        id: updatedMember.id,
        membershipId: updatedMember.membershipId,
        fullName: updatedMember.fullName,
        nrcNumber: updatedMember.nrcNumber,
        dateOfBirth: updatedMember.dateOfBirth,
        phone: updatedMember.phone,
        email: updatedMember.email,
        residentialAddress: updatedMember.residentialAddress,
        jurisdiction: {
          province: updatedMember.province,
          district: updatedMember.district,
          constituency: updatedMember.constituency,
          ward: updatedMember.ward,
          branch: updatedMember.branch,
          section: updatedMember.section
        },
        partyCommitment: updatedMember.partyCommitment,
        status: updatedMember.status,
        registrationDate: updatedMember.registrationDate
      }
    });

  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { memberId } = params;

    // Get member details
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId));

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        membershipId: member.membershipId,
        fullName: member.fullName,
        nrcNumber: member.nrcNumber,
        dateOfBirth: member.dateOfBirth,
        phone: member.phone,
        email: member.email,
        residentialAddress: member.residentialAddress,
        jurisdiction: {
          province: member.province,
          district: member.district,
          constituency: member.constituency,
          ward: member.ward,
          branch: member.branch,
          section: member.section
        },
        partyCommitment: member.partyCommitment,
        status: member.status,
        registrationDate: member.registrationDate
      }
    });

  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}