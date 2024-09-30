import { Story, User } from "@prisma/client";
import Image from "next/image";

type StoryWithUser = Story & {
  user: User;
};

const StoryModal = ({
  story,
  closeModal,
}: {
  story: StoryWithUser;
  closeModal: Function;
}) => {
  let displayName = `${story.user.firstName || ""} ${story.user.surName || ""}`;
  if (displayName.trim().length === 0) displayName = story.user.username;
  return (
    <div className="fixed bg-opacity-85 z-50 bg-black w-3/5 h-[90%] top-[5%] left-[20%] rounded-lg">
      <div className="flex items-center gap-4 bg-slate-400 p-4 rounded-t-lg">
        <Image
          src={story.user.avatar || "/noAvatar.png"}
          alt="profile pic"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold text-lg">{displayName}</span>
      </div>
      <div
        className="fixed bg-white top-16 right-[21%] p-4 rounded-full font-extrabold"
        onClick={() => closeModal()}
      >
        X
      </div>
      <div className="w-full flex justify-center items-center h-full">
        <Image
          width={500}
          height={500}
          alt=""
          className="w-200 h-200"
          src={story.img}
        />
      </div>
    </div>
  );
};

export default StoryModal;
