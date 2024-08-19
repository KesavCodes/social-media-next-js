"use client";
import { approveFollowRequest, declineFollowRequest } from "@/lib/actions";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & {
  sender: User;
};
const FriendRequestsList = ({
  followRequests,
}: {
  followRequests: RequestWithUser[];
}) => {
  const [followRequestList, setFollowRequestList] = useState(followRequests);
  const [optimisticFollowRequestList, setOptimisticFollowRequestList] =
    useOptimistic(followRequestList);

  const UpdateFollowList = async (
    requestId: number,
    senderId: string,
    type: "accept" | "decline"
  ) => {
    try {
      setOptimisticFollowRequestList((prevState) =>
        prevState.filter((request) => request.id !== requestId)
      );
      if (type === "accept") {
        await approveFollowRequest({ senderId });
      } else if (type === "decline") {
        await declineFollowRequest({ senderId });
      }
      setFollowRequestList((prevState) =>
        prevState.filter((request) => request.id !== requestId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {optimisticFollowRequestList.length? optimisticFollowRequestList.map((request) => {
        let userDisplayName = `${request.sender.firstName || ""} ${
          request.sender.surName || ""
        }`;
        if (userDisplayName.trim().length === 0)
          userDisplayName = request.sender.username;
        return (
          <div
            className="flex items-center justify-between mt-4"
            key={request.id}
          >
            <div className="flex items-center gap-2">
              <Image
                src={request.sender.avatar || "/noAvatar.png"}
                alt="profile pic"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{userDisplayName}</span>
            </div>
            <div className="flex gap-2 items-center">
              <form
                action={() =>
                  UpdateFollowList(request.id, request.sender.id, "accept")
                }
              >
                <button>
                  <Image
                    src="/accept.png"
                    alt="accept icon"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full cursor-pointer"
                  />
                </button>
              </form>
              <form
                action={() =>
                  UpdateFollowList(request.id, request.sender.id, "decline")
                }
              >
                <button>
                  <Image
                    src="/reject.png"
                    alt="reject icon"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full cursor-pointer"
                  />
                </button>
              </form>
            </div>
          </div>
        );
      }) : <p>No new request!</p>}
    </>
  );
};

export default FriendRequestsList;
