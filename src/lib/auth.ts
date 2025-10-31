import NextAuth, { NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle/db";
import { members, sessions, accounts } from "@/drizzle/schema";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { getMemberRolesAndPermissions } from "@/server/server.actions";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: members as any,
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

        return { id: user.id, email: user.email, name: user.fullName };
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      // user param is available in database session mode
      if (session.user && user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;
      }

      if (user?.id) {
        const { roles, permissions } = await getMemberRolesAndPermissions(user.id);
        session.user.role = roles[0] || "member";
        session.user.permissions = permissions;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
