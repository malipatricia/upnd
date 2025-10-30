// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { permissions, roles } from "@/drizzle/schema";

export async function GET() {
  try {
    const allPermissions = await db.select().from(permissions);
    return NextResponse.json(allPermissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}
