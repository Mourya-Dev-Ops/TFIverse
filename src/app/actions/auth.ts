"use server";

import { db } from "@/lib/db";
import { users, verificationTokens, userProfiles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";
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
