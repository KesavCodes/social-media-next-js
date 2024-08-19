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
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });
  if (!userData) return;
  const followersCount = userData._count.followers || 0;
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
            <Image
              src="https://images.unsplash.com/photo-1722197230024-f5bcb12b70c3?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="cover photo"
              height={20}
              width={20}
              className="rounded-full object-cover h-5 w-5"
            />
            <Image
              src="https://images.unsplash.com/photo-1722110650001-13a5025b198c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="cover photo"
              height={20}
              width={20}
              className="rounded-full object-cover h-5 w-5"
            />
            <Image
              src="https://images.unsplash.com/photo-1722218530941-fb046c70bb30?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="cover photo"
              height={20}
              width={20}
              className="rounded-full object-cover h-5 w-5"
            />
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
