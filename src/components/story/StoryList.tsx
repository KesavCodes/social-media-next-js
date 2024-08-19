"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({ stories }: { stories: StoryWithUser[] }) => {
  const { user: currentUser, isLoaded } = useUser();
  const [storyList, setStoryList] = useState(stories);
  const [image, setImage] = useState("");
  const [optimisticStoryList, setOptimisticStoryList] =
    useOptimistic(storyList);

  if (!currentUser && !isLoaded) return "Loading...";
  if (!currentUser && isLoaded) return null;

  const addStoryHandler = async () => {
    if (!image) return;
    setOptimisticStoryList((prevState) => [
      {
        id: Math.random(),
        createdAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        userId: currentUser.id,
        img: image,
        user: {
          id: currentUser.id,
          username: "Sending...",
          avatar: currentUser.imageUrl || "/noAvatar.png",
          cover: "",
          description: "",
          firstName: "",
          surName: "",
          city: "",
          school: "",
          work: "",
          website: "",
          createdAt: new Date(Date.now()),
        },
      },
      ...prevState,
    ]);
    try {
      const newStory = await addStory(image);
      setStoryList((prevList) => [newStory, ...prevList]);
      setImage("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
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
            <div className="flex flex-col items-center gap-2 cursor-pointer border-r-2 pr-4 border-gray-100 relative">
              <Image
                width={80}
                height={80}
                alt="profile pic"
                className="rounded-full w-20 h-20 ring-2 object-fit"
                src={image || currentUser?.imageUrl || "/noAvatar.png"}
                onClick={() => open()}
              />
              {image ? (
                <form action={addStoryHandler}>
                  <button className="text-white bg-blue-500 text-xs px-4 py-1 rounded-md">
                    send
                  </button>
                </form>
              ) : (
                <span>Your Story</span>
              )}
              <p
                className="absolute text-7xl text-white opacity-50"
                onClick={() => open()}
              >
                +
              </p>
            </div>
          );
        }}
      </CldUploadWidget>
      {optimisticStoryList.length ? (
        optimisticStoryList.map((story) => {
          const { user } = story;
          let displayName = user.firstName || user.username;
          return (
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              key={story.id}
            >
              <Image
                width={80}
                height={80}
                alt="profile pic"
                className="rounded-full w-20 h-20 ring-2"
                src={user.avatar || "noAvatar.png"}
              />
              <span>{displayName}</span>
            </div>
          );
        })
      ) : (
        <p className="m-auto">No stories</p>
      )}
    </>
  );
};

export default StoryList;
