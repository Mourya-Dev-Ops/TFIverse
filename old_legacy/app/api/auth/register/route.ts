import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userProfiles, verificationTokens } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      })
      .returning();

    // Generate unique username from email
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (true) {
      const existingProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.username, username),
      });

      if (!existingProfile) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create user profile
    await db.insert(userProfiles).values({
      userId: newUser.id,
      username,
    });

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours

    // Store verification token
    await db.insert(verificationTokens).values({
      identifier: email.toLowerCase(),
      token: verificationToken,
      expires,
    });

    // Send verification email
    await sendVerificationEmail({
      email: email.toLowerCase(),
      token: verificationToken,
      name,
    });

    return NextResponse.json(
      { 
        message: 'Account created! Please check your email to verify.',
        userId: newUser.id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
