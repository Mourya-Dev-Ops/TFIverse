import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { accounts, sessions, users, verificationTokens } from "@/lib/schema"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  ...authConfig,
  // Override providers to add Credentials (which needs Node.js runtime for db + bcrypt)
  providers: [
    ...authConfig.providers,
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
})
