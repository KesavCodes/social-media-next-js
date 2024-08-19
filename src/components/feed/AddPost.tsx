"use client";

import { addPost } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  if (!isLoaded) return "Loading...";

  const addPostHandler = async () => {
    if (!desc || !user) return;
    try {
      await addPost(desc, image);
      setDesc("");
    } catch (err) {
      console.log(err,'---err');
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 justify-between text-xs">
      {/* AVATAR */}
      <Image
        alt="profile pic"
        height={48}
        width={48}
        className="h-12 w-12 rounded-full object-cover"
        src={user?.imageUrl || "/noAvatar.png"}
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT AREA */}
        <form className="flex  gap-4" action={addPostHandler}>
          <textarea
            placeholder="what's on your mind?"
            className="bg-slate-100 rounded-lg flex-1 p-2"
            name="desc"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          ></textarea>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              src="/emoji.png"
              alt="emoji icon"
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer"
            />
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 max-[390px]:flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImage(
                typeof result?.info !== "string"
                  ? result?.info?.secure_url || ""
                  : ""
              );
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div className="flex gap-2 items-center cursor-pointer">
                  <Image
                    src="/addImage.png"
                    alt="gallery icon"
                    width={20}
                    height={20}
                    onClick={() => open()}
                  />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>

          <div className="flex gap-2 items-center cursor-pointer">
            <Image
              src="/addVideo.png"
              alt="movie play icon"
              width={20}
              height={20}
            />
            Video
          </div>
          <div className="flex gap-2 items-center cursor-pointer">
            <Image src="/poll.png" alt="gallery icon" width={20} height={20} />
            Poll
          </div>
          <div className="flex gap-2 items-center cursor-pointer">
            <Image
              src="/addEvent.png"
              alt="gallery icon"
              width={20}
              height={20}
            />
            Event
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
