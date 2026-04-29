import NextAuth from "next-auth"
import authConfig from "./auth.config"

// Use the edge-safe config (no db, no bcrypt) for middleware
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    // Match all routes except static files, images, and API auth
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
