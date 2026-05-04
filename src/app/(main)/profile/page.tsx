import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullProfileByEmail } from "@/app/actions/profile";
import ProfileDashboard from "./profile-dashboard";
import { getMemes } from "@/app/actions/memes";
import { getTierLists } from "@/app/actions/tierlist";

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

  const [memes, tierLists] = await Promise.all([
    getMemes({ userId: data.user.id }),
    getTierLists({ userId: data.user.id }),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pt-16">
        <ProfileDashboard
          user={data.user}
          profile={data.profile}
          followersCount={data.followersCount}
          followingCount={data.followingCount}
          memes={memes}
          tierLists={tierLists}
        />
      </div>
    </main>
  );
}
