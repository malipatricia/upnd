// /server/login.action.ts
"use server";

import { db } from "@/drizzle/db";
import { members } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";
import { addMemberSchema, loginSchema } from "@/schema/schema";
import z from "zod";
import { createHash } from "crypto";

export async function loginAction(
  unsafeData: z.infer<typeof loginSchema>
): Promise<{ error?: string; success?: boolean; user?: any }> {
  const parsed = loginSchema.safeParse(unsafeData);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(members)
    .where(eq(members.email, email.toLowerCase()));

  if (!user) return { error: "Invalid email or password" };

  const passwordMatch = await compare(password, user.passwordHash || "");
  if (!passwordMatch) return { error: "Invalid email or password" };

  // optional: return token or session info
  return {
    success: true,
    user: {
      id: user.id,
      name: user.fullName,
      role: user.role,
      email: user.email,
    },
  };
}

export async function registerMember(formData: unknown) {
  const parsed = addMemberSchema.safeParse(formData)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const data = parsed.data

  const hashPassword = (password: string) =>
  createHash("sha256").update(password).digest("hex");
  const password = hashPassword(data.password)

  try {
    // Example insert for Drizzle
   await db.insert(members).values({...data,passwordHash:password, dateOfBirth: data.dateOfBirth.toISOString().split("T")[0]});

    return { success: true }
  } catch (err) {
    console.error("DB insert failed", err)
    return { error: "Registration failed" }
  }
}