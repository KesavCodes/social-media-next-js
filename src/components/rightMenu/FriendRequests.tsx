import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import FriendRequestsList from "./FriendRequestsList";

const FriendRequests = async () => {
  const { userId } = auth();
  if (!userId) return;
  const followRequests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });
  if (followRequests.length === 0) return;
  return (
    <section className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <div className="flex justify-between">
        <span className="text-gray-500 font-semibold  ">Friend Request</span>
        <Link
          href="/"
          className="text-blue-500 cursor-pointer text-sm items-center font-medium"
        >
          See all
        </Link>
      </div>
      {/* USER */}
      <FriendRequestsList followRequests={followRequests} />
    </section>
  );
};

export default FriendRequests;
