import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import UserInfoInteraction from "./UserInfoInteraction";
import UpdateUser from "./UpdateUser";

const UserInfo = async ({ user }: { user: User }) => {
  const { userId: currentUserId } = auth();
  let displayName = `${user.firstName || ""} ${user.surName || ""}`;
  if (displayName.trim().length === 0) displayName = user.username;
  const joinedDate = user.createdAt.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;
  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });
    blockRes ? (isUserBlocked = true) : (isUserBlocked = false);

    const followerRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });
    followerRes ? (isFollowing = true) : (isFollowing = false);

    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });
    followReqRes ? (isFollowingSent = true) : (isFollowingSent = false);
  }
  return (
    <section className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* HEADER */}
      <header className="flex justify-between">
        <span className="text-gray-500 font-semibold">User Information</span>
        {currentUserId === user.id ? (
          <UpdateUser user={user}/>
        ) : (
          <Link
            href="/"
            className="text-blue-500 cursor-pointer text-sm items-center font-medium"
          >
            See all
          </Link>
        )}
      </header>
      {/* CONTENT */}
      <div className="flex flex-col gap-4 text-gray-500 mt-4">
        <div className="flex gap-2 items-center">
          <span className="text-xl text-black">{displayName}</span>
          <span className="text-sm">@{user.username}</span>
        </div>
        {user.description && <p>{user.description}</p>}
        {user.city && (
          <div className="flex items-center gap-2">
            <Image src="/map.png" alt="map icon" width={16} height={16} />
            <span>
              Living in <b>{user.city}</b>
            </span>
          </div>
        )}
        {user.school && (
          <div className="flex items-center gap-2">
            <Image src="/school.png" alt="school icon" width={16} height={16} />
            <span>
              Went to <b>{user.school}</b>
            </span>
          </div>
        )}
        {user.work && (
          <div className="flex items-center gap-2">
            <Image src="/work.png" alt="work icon" width={16} height={16} />
            <span>
              Works at <b>{user.work}</b>
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {user.website && (
            <div className="flex gap-2 items-center">
              <Image src="/link.png" alt="work icon" width={16} height={16} />
              <Link href={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <Image src="/date.png" alt="work icon" width={16} height={16} />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {currentUserId && currentUserId !== user.id && (
          <UserInfoInteraction
            userId={user.id}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
            isUserBlocked={isUserBlocked}
          />
        )}
      </div>
    </section>
  );
};

export default UserInfo;
