// pages/api/users/[userId].ts

import { db } from '@/drizzle/db';
import { members } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// API route handler for GET requests
export async function GET(request: Request, { params }: { params: { memberId: string } }) {
  const { memberId } = await params; // Get the userId from the URL
    // Query the database for the user by `userId`
    const member = await db
      .query
      .members
      .findMany({
        where: eq(members.id, memberId)
      })
      console.log(member)

      if (!member) {
        return NextResponse.json({ message: 'member not found' }, { status: 404 });
      }
      return NextResponse.json(member);
}

// API route handler for PATCH requests (updating member status)
export async function PATCH(request: Request, { params }: { params: { memberId: string } }) {
  try {
    const { memberId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Update the member status in the database
    const result = await db
      .update(members)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(members.id, memberId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      member: result[0] 
    });
  } catch (error) {
    console.error('Error updating member status:', error);
    return NextResponse.json({ 
      error: 'Failed to update member status' 
    }, { status: 500 });
  }
}