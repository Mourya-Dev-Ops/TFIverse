import type { NextAuthConfig } from "next-auth"

import Google from "next-auth/providers/google"

// Routes that DON'T require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
  "/icons",        // All celebrity profile pages
  "/u/",           // Public user profiles
];

// This config is Edge-compatible — NO database imports, NO bcrypt.
// The Credentials provider with authorize logic lives in auth.ts only.
export default {
  providers: [
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
      const isPublicRoute = pathname === "/" || PUBLIC_ROUTES.some(route => pathname.startsWith(route));

      const hasDOB = (auth?.user as any)?.hasDOB;

      // Allow static assets & API auth
      if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
        return true;
      }

      // If logged in but hasn't completed onboarding, force them to /onboarding
      if (isLoggedIn && !hasDOB && pathname !== "/onboarding" && !pathname.startsWith("/api/")) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      // If they are on onboarding but already have DOB, send them home
      if (isLoggedIn && hasDOB && pathname === "/onboarding") {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Public routes: always accessible
      if (isPublicRoute && pathname !== "/onboarding") {
        // If user IS logged in and tries to visit login/register, redirect to home
        if (isLoggedIn && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Everything else requires authentication
      if (isLoggedIn) return true;

      // Not logged in + not a public route = redirect to login
      if (pathname !== "/onboarding") {
         return false;
      }
      return false;
    },
  },
} satisfies NextAuthConfig
