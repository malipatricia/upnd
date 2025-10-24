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