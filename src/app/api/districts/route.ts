// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { districts } from "@/drizzle/schema";

export async function GET() {
  try {
    const allDistricts = await db.select().from(districts);
    return NextResponse.json(allDistricts);
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json({ error: "Failed to fetch districts" }, { status: 500 });
  }
}
