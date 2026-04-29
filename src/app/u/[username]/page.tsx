import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPublicProfile, isFollowing } from "@/app/actions/profile";
import PublicProfileClient from "./public-profile-client";

export default async function PublicProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const session = await auth();

  const data = await getPublicProfile(params.username);
  if (!data) notFound();

  let followingStatus = false;
  if (session?.user?.id) {
    followingStatus = await isFollowing(session.user.id, data.profile.userId);
  }

  const isOwnProfile = session?.user?.id === data.profile.userId;

  return (
    <PublicProfileClient
      user={data.user}
      profile={data.profile}
      followersCount={data.followersCount}
      followingCount={data.followingCount}
      isFollowingInitial={followingStatus}
      isOwnProfile={isOwnProfile}
      isLoggedIn={!!session?.user}
    />
  );
}
