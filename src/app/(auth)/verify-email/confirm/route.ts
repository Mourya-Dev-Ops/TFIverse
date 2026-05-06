import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(ip, 'verify-email', 10, 15 * 60 * 1000); // 10 attempts per 15 mins

    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Find token in database
    const existingTokens = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    const existingToken = existingTokens[0];

    if (!existingToken) {
      return NextResponse.json({ error: "Token does not exist" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Find user by email
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, existingToken.identifier));

    const existingUser = existingUsers[0];

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
    }

    // Update user to verified
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, existingUser.id));

    // Delete token
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, existingToken.identifier),
          eq(verificationTokens.token, existingToken.token)
        )
      );

    // Redirect to login with success message
    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
