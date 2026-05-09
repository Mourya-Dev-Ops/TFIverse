import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    // Always return success (security: don't reveal if email exists)
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, a reset link has been sent to your email.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    // Store reset token
    await db.insert(passwordResetTokens).values({
      email: email.toLowerCase(),
      token: resetToken,
      expires,
    });

    // Log reset URL to console (for development)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    console.log('\n🔐 ===== PASSWORD RESET =====');
    console.log('Email:', email);
    console.log('Reset URL:', resetUrl);
    console.log('============================\n');

    // TODO: Send email with reset link
    // await sendPasswordResetEmail({ email, token: resetToken, name: user.name });

    return NextResponse.json(
      { message: 'If an account exists, a reset link has been sent to your email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
