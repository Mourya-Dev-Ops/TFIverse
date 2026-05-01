import type { NextAuthConfig } from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// Routes that DON'T require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
];

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
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Allow all public/auth routes without login
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

      // Allow static assets & API auth
      if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
        return true;
      }

      // Public routes: always accessible
      if (isPublicRoute) {
        // If user IS logged in and tries to visit login/register, redirect to home
        if (isLoggedIn && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Everything else requires authentication
      if (isLoggedIn) return true;

      // Not logged in + not a public route = redirect to login
      return false;
    },
  },
} satisfies NextAuthConfig
