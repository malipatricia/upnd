// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { provinces } from "@/drizzle/schema";

export async function GET() {
  try {
    const allProvinces = await db.select().from(provinces);
    return NextResponse.json(allProvinces);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 500 });
  }
}
