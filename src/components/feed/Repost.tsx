import prisma from "@/lib/client";
import { Post as PostSchema, User } from "@prisma/client";
import Post from "./Post";
import Image from "next/image";
import PostOptions from "./PostOptions";

type PostData = PostSchema & {
  user: User;
  likes: {
    userId: string;
  }[];
  _count: {
    comments: number;
  };
  type: string;
  repostId?: number;
  repostDesc?: string;
};

const Repost = async ({
  postData,
  username,
}: {
  postData: PostData;
  username?: string;
}) => {
  if (!username) return;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return;
  let displayName = `${user.firstName || ""} ${user.surName || ""}`;
  if (displayName.trim().length === 0) displayName = user.username;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={user.avatar || "/noAvatar.png"}
            alt="profile pic"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{displayName}</span>
          <small className="text-white bg-blue-400 p-1 rounded-lg text-xs">
            re-posted
          </small>
        </div>

        {postData.repostId && (
          <PostOptions
            postId={postData.repostId}
            currentUserId={user.id}
            postUserId={user.id}
            type="repost"
          />
        )}
      </div>
      <div className="">{postData.repostDesc}</div>
      <div className="border border-gray-200 rounded-lg shadow-lg">
        <Post postData={postData} />
      </div>
    </div>
  );
};

export default Repost;
