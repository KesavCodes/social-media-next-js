import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const username = params.username;
  let userData;
  let isMyProfile;
  try {
    userData = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
            repost: true,
          },
        },
      },
    });
    if (!userData) return notFound();
    const { userId: currentUserId } = auth();
    isMyProfile = currentUserId === userData.id;
    if (currentUserId) {
      let isBlocked = await prisma.block.findFirst({
        where: {
          blockerId: userData.id,
          blockedId: currentUserId,
        },
      });
      if (isBlocked) userData = null;
    }
  } catch (err) {
    console.log(err);
  }
  if (!userData) return notFound();
  let displayName = `${userData.firstName || ""} ${userData.surName || ""}`;
  if (displayName.trim().length === 0) displayName = userData.username;
  return (
    <main className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type={isMyProfile ? "myProfile" : "otherProfile"} />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <Image
                src={userData.cover || "/noCover.png"}
                alt="cover photo"
                fill
                className="rounded-md object-cover"
              />
              <Image
                src={userData.avatar || "/noAvatar.png"}
                alt="profile photo"
                height={128}
                width={128}
                className="rounded-full object-cover absolute h-32 w-32 left-0 right-0 m-auto -bottom-16 ring-4 ring-white z-10"
              />
            </div>
            <h1 className="mt-20 mb-4 text-2xl font-medium">{displayName}</h1>
            <div className="flex items-center justify-between gap-12 mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">
                  {userData._count.posts + userData._count.repost}
                </span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{userData._count.followers}</span>
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">
                  {userData._count.followings}
                </span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
          <Feed username={userData.username} />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={userData} />
      </div>
    </main>
  );
};

export default ProfilePage;
