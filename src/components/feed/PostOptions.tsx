"use client";

import { deletePost } from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";

const PostOptions = ({
  postId,
  currentUserId,
  postUserId,
}: {
  postId: number;
  currentUserId: string;
  postUserId: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Image
        src="/more.png"
        alt="settings icon"
        width={20}
        height={20}
        className="w-5 h-5 rounded-full cursor-pointer"
        onClick={() => setOpen((prevState) => !prevState)}
      />
      {open && (
        <div className="absolute flex flex-col gap-2 top-4 right-0 bg-white rounded-md shadow-lg p-4 text-sm z-30 w-[100px]">
          <span className="cursor-pointer">View</span>
          <span className="cursor-pointer">Re-post</span>
          {currentUserId === postUserId && (
            <form action={() => deletePost(postId)}>
              <button className="text-red-500">Delete</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostOptions;
