"use client";

import { sharePost, switchLike } from "@/lib/actions";
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
  const [openShareModal, setOpenShareModal] = useState(false);
  const [desc, setDesc] = useState("");

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
  const shareHandler = async () => {
    try {
      await sharePost(desc, postId);
      setDesc("");
      setOpenShareModal(false);
    } catch (err) {
      console.log(err, "---err");
    }
  };

  if (!isLoaded) return "Loading...";

  return (
    <div className="flex items-center justify-between text-sm my-4">
      {openShareModal && (
        <form
          action={shareHandler}
          className="p-4 fixed w-1/5 h-1/4 top-[35%] left-[30%] bg-white rounded-md border shadow-md flex flex-col gap-2 md:w-1/2 xl:w-1/3 z-50 justify-around"
        >
          <label htmlFor="desc">Share as a post?</label>
          <textarea
            placeholder="Enter a caption..."
            className="bg-slate-100 rounded-lg flex-1 p-2"
            name="desc"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          ></textarea>
          <div className="flex gap-2">
            <button
              className="w-1/2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              type="submit"
            >
              Share
            </button>
            <button
              className="w-1/2 py-2 border-red-500 border text-red-500 rounded-md hover:bg-red-500 hover:text-white"
              onClick={() => setOpenShareModal(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
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
      <div className="cursor-pointer" onClick={() => setOpenShareModal(true)}>
        <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-xl">
          <Image src="/share.png" alt="profile pic" width={20} height={20} />
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
