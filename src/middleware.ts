import NextAuth from "next-auth"
import authConfig from "./auth.config"

// Use the edge-safe config (no db, no bcrypt) for middleware
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    // Match all routes EXCEPT:
    // - API auth routes
    // - Next.js internals (_next/static, _next/image)
    // - Static public assets (favicon, images, videos, fonts, etc.)
    "/((?!api/auth|_next/static|_next/image|favicon.ico|videos/.*|images/.*|frames/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mov|webm|woff|woff2|ttf|eot)).*)",
  ],
}

