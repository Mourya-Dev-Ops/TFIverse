import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import bcrypt from "bcryptjs"

export default {
  providers: [
    Github,
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const userResults = await db.select().from(users).where(eq(users.email, credentials.email as string));
        const user = userResults[0];

        if (!user || !user.password) {
          return null
        }
        
        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)
        if (passwordsMatch) {
          return user
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
