import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { members } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

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
