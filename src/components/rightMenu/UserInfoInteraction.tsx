"use client";

import { switchFollow, toggleBlock } from "@/lib/actions";
import { useOptimistic, useState } from "react";

const UserInfoInteraction = ({
  userId,
  isFollowing,
  isUserBlocked,
  isFollowingSent,
}: {
  userId: string;
  isFollowing: boolean;
  isUserBlocked: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    blocked: isUserBlocked,
    following: isFollowing,
    followingRequestSent: isFollowingSent,
  });
  const [optimisticUserState, setOptimisticUserState] =
    useOptimistic(userState);

  const toggleFollowHandler = async () => {
    try {
      setOptimisticUserState((prevState) => ({
        ...prevState,
        following: prevState.following && false,
        followingRequestSent:
          !prevState.following && !prevState.followingRequestSent
            ? true
            : false,
      }));
      await switchFollow(userId);
      setUserState((prevState) => ({
        ...prevState,
        following: prevState.following && false,
        followingRequestSent:
          !prevState.following && !prevState.followingRequestSent
            ? true
            : false,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleBlockHandler = async () => {
    try {
      setOptimisticUserState((prevState) => ({
        ...prevState,
        blocked: !prevState.blocked,
      }));
      await toggleBlock(userId);
      setUserState((prevState) => ({
        ...prevState,
        blocked: !prevState.blocked,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <form action={toggleFollowHandler}>
        <button className="bg-blue-500 text-white p-2 text-sm rounded-lg w-full">
          {optimisticUserState.followingRequestSent
            ? "Follow request sent"
            : optimisticUserState.following
            ? "Unfollow"
            : "Follow"}
        </button>
      </form>
      <form action={toggleBlockHandler} className="self-end">
        <button>
          <span className="text-red-400  text-xs cursor-pointer">
            {optimisticUserState.blocked ? "Unblock user" : "Block user"}
          </span>
        </button>
      </form>
    </>
  );
};

export default UserInfoInteraction;
