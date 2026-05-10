# TFIverse Platform - Consolidated Developer Notes

This document serves as the master record for the "scorched earth" rebuild and production-hardening of the TFIverse platform (Next.js 15, Turbopack, Drizzle ORM, PostgreSQL). 

## 1. Architecture & Foundation (Phase 1)
- **Tech Stack:** Migrated from a legacy React/JSON setup to a robust Next.js 15 App Router architecture.
- **Database:** Implemented Drizzle ORM with local PostgreSQL. Shifted all static JSON data (heroes, movies, memes) into a relational database to ensure infinite scalability and eliminate JSON bloat.
- **File Storage:** Configured Backblaze B2 (S3-compatible) with server-side pre-signed URLs to securely handle media uploads without exposing secret keys to the client.

## 2. Authentication & Security (Phase 2)
- **Provider Cleanup:** Removed legacy GitHub OAuth. Standardized to Google OAuth and standard Email/Password credentials for a streamlined UX.
- **Mandatory Onboarding:** Engineered a secure session callback using NextAuth JWTs. Users missing a Date of Birth (`hasDOB: false`) are forcefully redirected to `/onboarding` via Next.js Middleware before accessing the platform.
- **Password Recovery:** Developed a secure, token-based Forgot/Reset password flow with a 15-minute expiration window.
- **Rate Limiting:** Added custom in-memory rate limiting to all authentication endpoints (`/api/auth/*` equivalents via server actions) to prevent brute-force attacks.
- **CSRF Protection:** Hardened NextAuth with strict `AUTH_TRUST_HOST` configurations.

## 3. UI/UX Refinement (Phase 3)
- **Homepage:** 
  - Transformed into a high-end, cinematic Awwwards-grade experience.
  - Implemented responsive horizontal scroll panels with `snap-x snap-mandatory` for the Upcoming and OTT sections, drastically improving mobile UX.
  - Deployed lazy loading (`loading="lazy"`) across all heavy visual assets to optimize Initial Page Load (LCP).
- **Authentication Screens:**
  - Desktop: Retained the immersive cinematic background video.
  - Mobile: Implemented a highly optimized, glassmorphism dark-gradient fallback to save bandwidth and ensure native-like performance.
- **Bento Box Profiles:** Finalized the "Apple-style" premium user profile dashboard.

## 4. Meme Portal (Phase 4)
- **Integrity Constraints:** Added strict composite unique constraints (`user_id`, `meme_id`) at the PostgreSQL schema level for `meme_views` and `meme_likes`. This guarantees 100% accurate engagement tracking and prevents duplicate abuse.
- **Features:** 
  - Implemented secure meme deletion and editing (strictly locked to the meme's original author).
  - Integrated public user profiles into meme cards (displays avatar, username, and links to `/u/[username]`).
  - Added native Web Share API functionality.

## Next Steps
- Continue populating the PostgreSQL database with the remaining "Rising Stars" and "Legends" data.
- Monitor production logs for any unhandled edge cases in the NextAuth middleware.
- Scale rate limiting from in-memory to Redis (Upstash) when deploying to a distributed edge environment.
