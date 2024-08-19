import prisma from "@/lib/client";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const UserMedia = async ({ user }: { user: User }) => {
  const postWithMedia = await prisma.post.findMany({
    where: {
      userId: user.id,
      img: { not: null },
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <section className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <header className="flex justify-between">
        <span className="text-gray-500 font-semibold">User Media</span>
        <Link
          href="/"
          className="text-blue-500 cursor-pointer text-sm items-center font-medium"
        >
          See all
        </Link>
      </header>
      {/* BOTTOM */}
      <div className="flex gap-4 flex-wrap mt-4">
        {postWithMedia.length ? postWithMedia.map((post) => (
          <div key={post.id} className="relative w-1/5 h-24">
            <Image
              src={post.img!}
              alt={post.desc}
              fill
              className="rounded-md object-cover"
            />
          </div>
        )): "No media found"}
      </div>
    </section>
  );
};

export default UserMedia;
