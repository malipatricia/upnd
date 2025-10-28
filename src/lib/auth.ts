import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle/db";
import { members, sessions, accounts } from "@/drizzle/schema";
import { compare } from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: members,
    sessionsTable: sessions,
    accountsTable: accounts,
  }),
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(members)
          .where(eq(members.email, credentials.email.toLowerCase()));

        if (!user) return null;

        const valid = await compare(credentials.password, user.passwordHash || "");
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role || 'member', // Default to 'member' if role is null/undefined
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // In v4, user is only available when using database sessions or during sign-in
      if (user) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      } else if (token) {
        // Fallback to token if user is not available
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
  },
};
