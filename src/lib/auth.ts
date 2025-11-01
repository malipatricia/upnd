import NextAuth, { NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle/db";
import { members, sessions, accounts } from "@/drizzle/schema";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { getMemberRolesAndPermissions } from "@/server/server.actions";
import { normalizeRole } from "@/lib/roles";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: members as any,
    sessionsTable: sessions,
    accountsTable: accounts,
  }),
  session: { strategy: "jwt" },
  pages: { signIn: "/admin" },
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

        const { roles, permissions } = await getMemberRolesAndPermissions(user.id);
        const primaryRole = normalizeRole(roles[0]) ?? "member";

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          constituency: user.constituency,
          role: primaryRole,
          permissions,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.constituency = (user as any).constituency ?? undefined;
        token.role = user.role ? normalizeRole(user.role) : token.role ?? "member";
        token.permissions = user.permissions ?? token.permissions ?? [];
      } else if (token?.id && (!token.role || !token.permissions)) {
        const { roles, permissions } = await getMemberRolesAndPermissions(token.id as string);
        token.role = token.role ?? normalizeRole(roles[0]) ?? "member";
        token.permissions = token.permissions ?? permissions;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.email = (token.email as string | null | undefined) ?? session.user.email;
        session.user.name = (token.name as string | null | undefined) ?? session.user.name;
        session.user.constituency = token.constituency as string | undefined;
        session.user.role = (token.role as string) ?? session.user.role ?? "member";
        session.user.permissions = (token.permissions as string[]) ?? session.user.permissions ?? [];
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
