// src/app/api/members/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db"; // adjust path to your db export
import { members } from "@/drizzle/schema"; // adjust path
import { addMemberSchema } from "@/schema/schema"; // your zod schema
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate with your Zod schema (addMembers)
    const parsed = addMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: true, issues: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    // Hash password (bcryptjs)
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Map the incoming values to DB types expected by Drizzle:
    // - date fields -> Date objects
    // - numeric fields (latitude/longitude stored as numeric) -> strings (Drizzle expects string for numeric)
    // - optional fields omit or set null
    const insertPayload: any = {
      // auth fields
      name: data.fullName ?? null,
      email: data.email,
      passwordHash,
      isVerified: data.isVerified ?? false,
      role: data.role ?? "member",
      // membership core
      membershipId: (data.membershipId ?? data.membershipId) || (data.email?.split("@")[0] ?? null),
      fullName: data.fullName,
      nrcNumber: data.nrcNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender ?? "Male",
      phone: data.phone,
      residentialAddress: data.residentialAddress,
      // geo (drizzle numeric expects strings for numeric)
      latitude: data.latitude != null ? String(data.latitude) : null,
      longitude: data.longitude != null ? String(data.longitude) : null,
      // location
      province: data.province,
      district: data.district,
      constituency: data.constituency,
      ward: data.ward,
      branch: data.branch,
      section: data.section,
      // other fields
      education: data.education ?? null,
      occupation: data.occupation ?? null,
      skills: data.skills ?? null, // if your column is text[]. Drizzle will accept array
      membershipLevel: data.membershipLevel ?? "General",
      partyRole: data.partyRole ?? null,
      partyCommitment: data.partyCommitment ?? null,
      status: data.status ?? "Pending Section Review",
      profileImage: data.profileImage ?? null,
      notificationPreferences: data.notificationPreferences ?? { sms: true, push: true, email: true },
      // emailVerified left null at signup
      emailVerified: null,
      // createdAt/updatedAt/registrationDate are DB defaults (do not set)
    };

    // Insert using Drizzle
    const result = await db.insert(members).values(insertPayload);

    return NextResponse.json({ error: false, data: result }, { status: 201 });
  } catch (err: any) {
    console.error("members POST error:", err);
    return NextResponse.json({ error: true, message: err?.message ?? "Unknown" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberIds, status } = body;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({ error: 'memberIds array is required' }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Update multiple members' status
    const result = await db
      .update(members)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(sql`${members.id} = ANY(${memberIds})`)
      .returning();

    return NextResponse.json({ 
      success: true, 
      updatedCount: result.length,
      members: result
    });
  } catch (error) {
    console.error('Error bulk updating member status:', error);
    return NextResponse.json({ 
      error: 'Failed to bulk update member status' 
    }, { status: 500 });
  }
}
