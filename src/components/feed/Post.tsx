import Image from "next/image";
import Comment from "./Comment";
import { Post as PostSchema, User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostOptions from "./PostOptions";

type PostData = PostSchema & {
  user: User;
  likes: {
    userId: string;
  }[];
  _count: {
    comments: number;
  };
};
const Post = ({ postData }: { postData: PostData }) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return;
  const { user: userData } = postData;
  let displayName = `${userData.firstName || ""} ${userData.surName || ""}`;
  if (displayName.trim().length === 0) displayName = userData.username;
  const commentCount = postData._count.comments;
  return (
    <article className="flex flex-col gap-4 shadow-sm rounded-md p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={userData.avatar || "/noAvatar.png"}
            alt="profile pic"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{displayName}</span>
        </div>
        <PostOptions
          postId={postData.id}
          currentUserId={currentUserId}
          postUserId={postData.userId}
        />
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4">
        {postData.img && (
          <div className="w-full min-h-96 relative">
            <Image
              src={postData.img}
              alt="post pic"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        <p>{postData.desc}</p>
      </div>
      {/* INTERACTION */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={postData.id}
          likesArr={postData.likes}
          commentCount={commentCount}
        />
      </Suspense>
      <Suspense fallback="Loading...">
        <Comment postId={postData.id} />
      </Suspense>
    </article>
  );
};

export default Post;
