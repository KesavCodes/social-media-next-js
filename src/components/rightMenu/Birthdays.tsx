import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const Birthdays = async () => {
  const { userId } = auth();
  if (!userId) return;
  const birthdays = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          birthDay: true,
          username: true,
          firstName: true,
          surName: true,
          avatar: true,
        },
      },
    },
  });

  const upcomingBirthdays = birthdays
    .filter(({ following }) => {
      if (!following.birthDay) return false;
      const modifyBirthdayDate = new Date(
        following.birthDay.setFullYear(new Date().getFullYear())
      );
      const dateOneMonthFromNow = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      );
      return (
        modifyBirthdayDate.valueOf() > new Date().valueOf() &&
        modifyBirthdayDate.valueOf() < dateOneMonthFromNow.valueOf()
      );
    })
    .map((item) => item.following);

  if (!upcomingBirthdays.length) return;
  return (
    <section className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <div className="flex justify-between">
        <span className="text-gray-500 font-semibold">Birthdays</span>
      </div>
      {upcomingBirthdays.map((item) => {
        let displayName = `${item.firstName || ""} ${item.surName || ""}`;
        if (displayName.trim().length === 0) displayName = item.username;
        return (
          <div className="flex items-center justify-between mt-4" key={item.id}>
            <div className="flex items-center gap-2">
              <Image
                src={item.avatar || "/noAvatar.png"}
                alt="profile pic"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{displayName}</span>
            </div>
            <button className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md">
              Celebrate
            </button>
          </div>
        );
      })}

      {/* UPCOMING BIRTHDAYS */}
      <div className="flex p-4 mt-4 bg-slate-100 rounded-lg items-center gap-2">
        <Image src="/gift.png" alt="profile pic" width={24} height={24} />
        <Link className="flex flex-col gap-1 text-xs" href="/">
          <span className="text-gray-700 font-semibold">
            Upcoming Birthdays
          </span>
          <span className="text-gray-500">
            {upcomingBirthdays.length > 3
              ? `See other ${upcomingBirthdays.length - 3} upcoming birthdays`
              : "No more upcoming birthdays"}
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Birthdays;
