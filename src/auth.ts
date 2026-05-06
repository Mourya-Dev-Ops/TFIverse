import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { accounts, sessions, users, verificationTokens } from "@/lib/schema"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import { userProfiles } from "@/lib/schema"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Fetch avatar from userProfiles
        const [profile] = await db.select({ 
          avatarUrl: userProfiles.avatarUrl,
        })
          .from(userProfiles)
          .where(eq(userProfiles.userId, user.id as string));
          
        if (profile?.avatarUrl) {
          token.picture = profile.avatarUrl;
        } else if (user.image) {
          token.picture = user.image;
        }
      }
      if (trigger === "update" && session?.image) {
        token.picture = session.image;
      }
      return token
    },
    async session({ session, token }) {
      const userId = (token?.sub || token?.id) as string;
      if (userId && session.user) {
        session.user.id = userId;
      }
      return session
    },
  },
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
          if (!user.emailVerified) {
            throw new Error("Email not verified. Please check your inbox.")
          }
          return user
        }
        return null
      }
    })
  ],
})
