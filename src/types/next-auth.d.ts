import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      email?: string | null;
      name?: string | null;
      constituency?: string;
      permissions?: string[]; // optional
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    email?: string | null;
    name?: string | null;
    constituency?: string;
    permissions?: string[]; // optional
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    constituency?: string;
    permissions?: string[]; // optional
  }
}
