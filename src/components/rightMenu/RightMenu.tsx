import { User } from "@prisma/client";
import Ad from "../Ad";
import Birthdays from "./Birthdays";
import FriendRequests from "./FriendRequests";
import UserInfo from "./UserInfo";
import UserMedia from "./UserMedia";
import { Suspense } from "react";

const RightMenu = ({ user }: { user?: User }) => {
  return (
    <section className="flex flex-col gap-6">
      {user ? (
        <>
          <Suspense fallback="Loading...">
            <UserInfo user={user} />
          </Suspense>
          <Suspense fallback="Loading...">
            <UserMedia user={user} />
          </Suspense>
        </>
      ) : null}
      <FriendRequests />
      <Birthdays />
      <Ad size={"md"} />
    </section>
  );
};

export default RightMenu;
