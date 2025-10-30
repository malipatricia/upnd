// src/app/api/members/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { members } from "@/drizzle/schema";

export async function GET() {
  try {
    const allMembers = await db.select().from(members);
    return NextResponse.json({ members: allMembers });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
