import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/drizzle/db";
import { members } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) return null;

        const [user] = await db
          .select()
          .from(members)
          .where(eq(members.email, email.toLowerCase()));

        if (!user) return null;

        const isValid = await compare(password, user.passwordHash || "");
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.fullName,
          email: user.email,
          constituency: user.constituency,
          role: user.role || '',
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin", // where your login page lives
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.constituency = user.constituency;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.constituency = token.constituency;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
