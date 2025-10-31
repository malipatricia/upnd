// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { platformSettings } from "@/drizzle/schema";
import { updateSettings } from "@/server/server.actions";

export async function GET() {
  try {
    const UPNDSettings = await db.select().from(platformSettings);
    console.log(updateSettings)
    return NextResponse.json(UPNDSettings);
  } catch (error) {
    console.error("Error fetching paltform settings:", error);
    return NextResponse.json({ error: "Failed to fetch platform settings" }, { status: 500 });
  }
}
