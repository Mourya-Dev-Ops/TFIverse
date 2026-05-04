"use server";

import { db } from "@/lib/db";
import { userProfiles } from "@/lib/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const dobString = formData.get("dateOfBirth") as string;
  if (!dobString) {
    throw new Error("Date of Birth is required");
  }

  const dateOfBirth = new Date(dobString);
  
  if (isNaN(dateOfBirth.getTime())) {
    throw new Error("Invalid date format");
  }

  // Check if profile exists, if not create one
  const [existingProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, session.user.id));

  if (existingProfile) {
    await db.update(userProfiles)
      .set({ dateOfBirth })
      .where(eq(userProfiles.userId, session.user.id));
  } else {
    await db.insert(userProfiles).values({
      userId: session.user.id,
      username: `user_${session.user.id.substring(0, 8)}`,
      dateOfBirth,
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}
