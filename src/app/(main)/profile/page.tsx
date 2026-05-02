import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullProfileByEmail } from "@/app/actions/profile";
import ProfileDashboard from "./profile-dashboard";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const data = await getFullProfileByEmail(session.user.email);

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-neutral-500">Profile not found. Please contact support.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pt-16">
        <ProfileDashboard
          user={data.user}
          profile={data.profile}
          followersCount={data.followersCount}
          followingCount={data.followingCount}
        />
      </div>
    </main>
  );
}
