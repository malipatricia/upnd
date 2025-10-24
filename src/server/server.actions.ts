// /server/login.action.ts
"use server";

import { db } from "@/drizzle/db";
import { members } from "@/drizzle/schema";
import { AnyColumn, eq } from "drizzle-orm";
import { hash, compare } from "bcrypt";
import { addMemberSchema, loginSchema } from "@/schema/schema";
import z from "zod";

export async function loginAction(
  unsafeData: z.infer<typeof loginSchema>
): Promise<{ error?: string; success?: boolean; user?: any }> {
  const parsed = loginSchema.safeParse(unsafeData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  // Find user by email
  const [user] = await db
    .select()
    .from(members)
    .where(eq(members.email, email.toLowerCase()));

  if (!user) return { error: "Invalid email or password" };

  // Compare password using bcrypt
  const passwordMatch = await compare(password, user.passwordHash || "");
  if (!passwordMatch) return { error: "Invalid email or password" };

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

export async function exists<T extends keyof typeof members>(
  column: AnyColumn,
  value: string | null
): Promise<boolean> {
  if (value === null) return false;

  const record = await db.query.members.findFirst({
    where: (u, { eq }) => eq(column, value),
    columns: { id: true },
  });

  return !!record;
}

export async function registerMember(formData: unknown) {
  const parsed = addMemberSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;
  const email = data.email?data.email:null
  // first chek unique email
  if (email !== null) {
    try{
    const emailExists = await exists(members.email, email);
    if (emailExists) {
      return {error: 'Email already exists'}
    }}catch{
      return{error: 'Failed: email query'}
    }
  }

  // check nrc uniqueness
  try{const nrcExists = await exists(members.nrcNumber, data.nrcNumber);
  if (nrcExists) {
    return {error: 'NRC already exists'}
  }}catch {
    return {error: 'Failed: nrc query'}
  }
  
        // nrc is unique so post
        // ✅ Use bcrypt to hash the password securely
        const passwordHash = await hash(data.password, 10); // salt rounds = 10

        try {
          await db.insert(members).values({
            ...data,
            passwordHash,
            dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
            email: email
          });

          const id = await db.query.members.findFirst({where: eq(members.nrcNumber, data.nrcNumber)})

          return { success: true, memberId: id?.id};
        } catch (err) {
          console.error("DB insert failed", err);
          return { error: "Registration failed" };
        }
}
