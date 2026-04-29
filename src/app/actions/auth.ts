"use server";

import { db } from "@/lib/db";
import { users, verificationTokens, userProfiles, passwordResetTokens } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Next.js requires this for redirect to work
  }
}

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }

    const existingUsers = await db.select().from(users).where(eq(users.email, email));
    if (existingUsers.length > 0) {
      return { error: "Email is already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    // Auto-create a user profile
    const randomUsername = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() + Math.floor(Math.random() * 10000);
    await db.insert(userProfiles).values({
      userId: newUser.id,
      username: randomUsername,
    });

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    const emailResult = await sendVerificationEmail({
      email,
      name,
      token,
    });

    if (!emailResult.success) {
      console.error("Failed to send email", emailResult.error);
    }

    return { success: true, message: "Verification email sent!" };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration" };
  }
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────────
export async function forgotPassword(formData: FormData) {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return { error: "Email is required" };
    }

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    // Always return success to prevent email enumeration attacks
    if (!existingUser) {
      return { success: true };
    }

    // Delete any existing reset tokens for this email
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email));

    // Create new token (expires in 1 hour)
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    await db.insert(passwordResetTokens).values({
      email,
      token,
      expires,
    });

    await sendPasswordResetEmail({
      email,
      name: existingUser.name || "User",
      token,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return { error: "Something went wrong" };
  }
}

// ─── RESET PASSWORD ──────────────────────────────────────────────
export async function resetPassword(formData: FormData) {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token || !password) {
      return { error: "Missing required fields" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }

    // Find token
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    if (!resetToken) {
      return { error: "Invalid or expired reset link" };
    }

    if (new Date(resetToken.expires) < new Date()) {
      // Clean up expired token
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
      return { error: "Reset link has expired. Please request a new one." };
    }

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, resetToken.email));
    if (!user) {
      return { error: "User not found" };
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));

    // Delete used token
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));

    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { error: "Something went wrong" };
  }
}

