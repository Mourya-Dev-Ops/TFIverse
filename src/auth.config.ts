import type { NextAuthConfig } from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// This config is Edge-compatible — NO database imports, NO bcrypt.
// The Credentials provider with authorize logic lives in auth.ts only.
export default {
  providers: [
    Github,
    Google,
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
