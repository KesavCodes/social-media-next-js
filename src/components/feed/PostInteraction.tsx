"use client";

import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useOptimistic, useState } from "react";

const PostInteraction = ({
  postId,
  likesArr,
  commentCount,
}: {
  postId: number;
  likesArr: { userId: string }[];
  commentCount: number;
}) => {
  const { isLoaded, userId } = useAuth();
  const [likeState, setLikeState] = useState({
    totalLikes: likesArr.length,
    isLiked: likesArr.some((like) => like.userId === userId),
  });
  const [optimisticLikeState, setOptimisticLikeState] =
    useOptimistic(likeState);

  const likeAction = async () => {
    setOptimisticLikeState((prevState) => {
      return {
        totalLikes: prevState.isLiked
          ? prevState.totalLikes - 1
          : prevState.totalLikes + 1,
        isLiked: !prevState.isLiked,
      };
    });
    try {
      await switchLike(postId);
      setLikeState((prevState) => {
        return {
          totalLikes: prevState.isLiked
            ? prevState.totalLikes - 1
            : prevState.totalLikes + 1,
          isLiked: !prevState.isLiked,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (!isLoaded) return "Loading...";

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-xl">
          <form action={likeAction}>
            <button>
              <Image
                src={optimisticLikeState.isLiked ? "/liked.png" : "/like.png"}
                alt="profile pic"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLikeState.totalLikes}{" "}
            <span className="hidden md:inline">
              Like{optimisticLikeState.totalLikes > 1 ? "s" : ""}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-xl">
          <Image
            src="/comment.png"
            alt="profile pic"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {commentCount}{" "}
            <span className="hidden md:inline">
              Comment{commentCount > 1 ? "s" : ""}
            </span>
          </span>
        </div>
      </div>
      <div className="">
        <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-xl">
          <Image
            src="/share.png"
            alt="profile pic"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            <span className="hidden md:inline">Share</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;
