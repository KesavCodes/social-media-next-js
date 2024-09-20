"use client";

import { Comment as CommentSchema, User } from "@prisma/client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useOptimistic, useState } from "react";
import { addComment } from "@/lib/actions";

type CommentDataType = CommentSchema & {
  user: User;
};
const CommentList = ({
  postId,
  commentsData,
}: {
  postId: number;
  commentsData: CommentDataType[];
}) => {
  const { user } = useUser();
  const [desc, setDesc] = useState("");
  const [comments, setComments] = useState(commentsData);
  const [optimisticComment, setOptimisticComment] = useOptimistic(comments);

  const descSubmitHandler = async () => {
    if (!desc || !user) return;
    setOptimisticComment((prevState) => {
      const placeholderComment = {
        id: Math.random(),
        desc,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        userId: user.id,
        postId,
        user: {
          id: user.id,
          username: "Sending Please Wait...",
          avatar: user.imageUrl || "/noAvatar.png",
          cover: "",
          description: "",
          firstName: "",
          surName: "",
          city: "",
          school: "",
          work: "",
          website: "",
          createdAt: new Date(Date.now()),
          birthDay: new Date(Date.now()),
        },
      };
      return [placeholderComment, ...prevState];
    });
    try {
      const createdComment = await addComment(postId, desc);
      setComments((prevComment) => [createdComment, ...prevComment]);
      setDesc("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Image
          src={user?.imageUrl || "/noAvatar.png"}
          alt="profile pic"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
        />
        <form
          className="flex flex-1 items-center justify-between bg-slate-100 rounded-xl w-full text-sm px-6 py-2"
          action={descSubmitHandler}
        >
          <input
            type="text"
            name="desc"
            placeholder="Write a comment"
            className="bg-transparent outline-none flex-1"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />
          <div className="flex gap-2">
            <Image
              src="/emoji.png"
              alt="emoji icon"
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer"
            />
            <button>
              <Image
                src="/send.png"
                alt="send icon"
                width={20}
                height={20}
                className="w-5 h-5 cursor-pointer"
              />
            </button>
          </div>
        </form>
      </div>
      {optimisticComment &&
        optimisticComment.length > 0 &&
        optimisticComment.map((comment) => {
          const { user } = comment;
          let displayName = `${user.firstName || ""} ${user.surName || ""}`;
          if (displayName.trim().length === 0) displayName = user.username;
          return (
            <div
              className="flex justify-between sm:gap-4 mt-6"
              key={comment.id}
            >
              <div className="flex sm:gap-4">
                {/* AVATAR */}
                <Image
                  src={user.avatar || "/noAvatar.png"}
                  alt="profile pic"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                {/* DESC */}
                <div className="flex flex-col gap-2 px-4">
                  <span className="font-medium">{displayName}</span>
                  <p className="">{comment.desc}</p>
                  <div className="flex items-center text-sm gap-8">
                    <div className="flex items-center gap-4 p-2  bg-slate-50 rounded-xl">
                      <Image
                        src="/like.png"
                        alt="profile pic"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500 ">
                        27 <span className="hidden md:inline">Likes</span>
                      </span>
                    </div>
                    <div className="text-gray-500">Reply</div>
                  </div>
                </div>
              </div>
              {/* ICON */}
              <Image
                src="/more.png"
                alt="settings icon"
                width={20}
                height={20}
                className="w-5 h-5 rounded-full cursor-pointer"
              />
            </div>
          );
        })}
    </>
  );
};

export default CommentList;
