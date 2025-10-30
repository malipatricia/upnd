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

        // return minimal info — roles/permissions handled in JWT callback
        return { id: user.id, email: user.email, name: user.fullName };
      },
    }),
  ],

  callbacks: {
    // Attach permissions and roles on token creation/use
    async jwt({ token, user }) {
      // If user just logged in, fetch roles/permissions
      if (user) {
        const { roles, permissions } = await getMemberRolesAndPermissions(user.id);
        token.id = user.id;
        token.role = roles[0] || "member";
        token.permissions = permissions;
      }

      // If token already exists, ensure permissions are set
      if (token.id && !token.permissions) {
        const { roles, permissions } = await getMemberRolesAndPermissions(token.id);
        token.role = roles[0] || token.role || "member";
        token.permissions = permissions;
      }

      return token;
    },

    // Map JWT to session object
    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.role = token.role;
      session.user.permissions = token.permissions || [];
      return session;
    },
  },
};

export default NextAuth(authOptions);
