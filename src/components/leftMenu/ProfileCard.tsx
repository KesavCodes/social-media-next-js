import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const ProfileCard = async () => {
  const { userId } = auth();
  if (!userId) return;
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        select: {
          following: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!userData) return;
  const followersCount = userData.followers.length || 0;
  const miniFollowerAvatars = userData.followers.map((item) => item.following);
  let displayName = `${userData.firstName || ""} ${userData.surName || ""}`;
  if (displayName.trim().length === 0)
    displayName = userData.username || "Unknown user";
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col">
      <div className="h-24 relative">
        <Image
          src={userData.cover || "/noCover.png"}
          alt="cover photo"
          fill
          className="rounded-md object-cover"
        />
        <Image
          src={userData.avatar || "/noAvatar.png"}
          alt="profile photo"
          height={64}
          width={64}
          className="rounded-full object-cover absolute h-16 w-16 left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
        />
      </div>
      <div className="h-32 flex flex-col gap-2 items-center justify-end">
        <span className="font-semibold">{displayName}</span>
        <div className="flex gap-4 items-center">
          <div className="flex">
            {miniFollowerAvatars.map((follower) => (
              <Image
                key={follower.id}
                src={follower.avatar || "/noAvatar.png"}
                alt="cover photo"
                height={20}
                width={20}
                className="rounded-full object-cover h-5 w-5"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {followersCount} {`follower${followersCount > 1 ? "s" : ""}`}
          </span>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded-md text-xs">
          <Link href={`/profile/${userData.username}`}>My Profile</Link>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
