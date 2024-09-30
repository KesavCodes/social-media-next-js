import prisma from "@/lib/client";
import Ad from "../Ad";
import Post from "./Post";
import { auth } from "@clerk/nextjs/server";
import { Post as PostSchema, User } from "@prisma/client";
import { notFound } from "next/navigation";
import Repost from "./Repost";

type PostData = PostSchema & {
  type: string;
  repostId?: number;
  repostDesc?: string;
  repostDate: Date | null;
  user: User;
  likes: {
    userId: string;
  }[];
  _count: {
    comments: number;
  };
};
const Feed = async ({ username }: { username?: string }) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return;

  let feedData: PostData[] = [];
  if (username) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return notFound();
    const isFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user?.id,
      },
    });
    if (!isFollow && currentUserId !== user.id) return;
    const userPosts = await prisma.post.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    const sharedPosts = await prisma.sharedPost.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          include: {
            user: true,
            likes: {
              select: {
                userId: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
        },
      },
    });
    feedData = [
      ...userPosts.map((item) => ({
        ...item,
        type: "original",
        repostDesc: "",
        repostId: undefined,
        repostDate: null,
      })),
      ...sharedPosts.map((record) => ({
        ...record.post,
        type: "re-post",
        repostDesc: record.desc ?? "",
        repostId: record.id,
        repostDate: record.createdAt,
      })),
    ];
    console.log(feedData);
  } else {
    const following = await prisma.follower.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });
    const allPosts = await prisma.post.findMany({
      where: {
        userId: {
          in: [...following.map((follow) => follow.followingId), currentUserId],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    feedData = allPosts.map((post) => ({
      ...post,
      type: "original",
      repostDate: null,
    }));
  }

  feedData = feedData.sort((a, b) => {
    return (
      new Date(b.type === "re-post" ? b.repostDate! : b.createdAt).valueOf() -
      new Date(a.type === "re-post" ? a.repostDate! : a.createdAt).valueOf()
    );
  });
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-12">
      {feedData.length ? (
        feedData.map((feedItem, index) => {
          return (
            <>
              {index !== 0 && index % 3 === 0 && <Ad size="lg" />}
              {feedItem.type === "original" && (
                <Post postData={feedItem} key={feedItem.id} />
              )}
              {feedItem.type === "re-post" && (
                <Repost
                  postData={feedItem}
                  key={feedItem.id}
                  username={username}
                />
              )}
            </>
          );
        })
      ) : (
        <p>No post found!</p>
      )}
    </div>
  );
};

export default Feed;
