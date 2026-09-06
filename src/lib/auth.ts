// src/lib/auth.ts
import NextAuth, {
  DefaultSession,
  NextAuthOptions,
  getServerSession,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "client" | "partner" | "affiliate" | "employee";
      preferredLocale: "pl" | "en" | "es";
    } & DefaultSession["user"];
  }

  interface User {
    role: "admin" | "client" | "partner" | "affiliate" | "employee";
    preferredLocale: "pl" | "en" | "es";
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        await dbConnect();

        const user = await User.findOne({ email: String(credentials.email).trim().toLowerCase() });
        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          preferredLocale: user.preferredLocale,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.preferredLocale = (user as any).preferredLocale;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).preferredLocale = token.preferredLocale;
      }
      return session;
    },
  },
};

// Helper for server components / route handlers
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

// Restrict route handlers to admin
export async function requireAdmin() {
  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}
