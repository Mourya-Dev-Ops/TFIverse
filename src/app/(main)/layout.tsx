import { auth } from "@/auth";
import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  let userImage = session?.user?.image;
  
  // Fetch fresh avatar from DB to prevent stale session images
  if (session?.user?.email) {
    try {
      const { users } = await import("@/lib/schema");
      const [profile] = await db
        .select({ avatarUrl: userProfiles.avatarUrl })
        .from(userProfiles)
        .innerJoin(users, eq(users.id, userProfiles.userId))
        .where(eq(users.email, session.user.email))
        .limit(1);
        
      if (profile?.avatarUrl) {
        userImage = profile.avatarUrl;
      }
    } catch (error) {
      console.error("Layout: Failed to fetch fresh avatar from DB:", error);
      // Fallback to session image already handled
    }
  }

  const userForNavbar = session?.user ? { ...session.user, image: userImage } : null;

  return (
    <>
      <Navbar user={userForNavbar} />
      {/* Add padding top to account for fixed navbar */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {children}
      </main>
    </>
  );
}
