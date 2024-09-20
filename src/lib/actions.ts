"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User not Authenticated!");
  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });
    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const toggleBlock = async (userId: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User not Authenticated!");
  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });
    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const approveFollowRequest = async ({
  senderId,
}: {
  senderId: string;
}) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User not Authenticated!");
  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId,
        receiverId: currentUserId,
      },
    });
    if (existingFollowRequest) {
      await prisma.follower.create({
        data: {
          followerId: senderId,
          followingId: currentUserId,
        },
      });
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async ({
  senderId,
}: {
  senderId: string;
}) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User not Authenticated!");
  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId,
        receiverId: currentUserId,
      },
    });
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    return {
      success: false,
      error: true,
    };
  }
  const updatedData = Object.fromEntries(payload.formData);

  const Profile = z.object({
    firstName: z.string().max(60).optional(),
    surName: z.string().max(60).optional(),
    cover: z.string().optional(),
    description: z.string().max(300).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse({
    cover: payload.cover,
    ...updatedData,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: true,
    };
  }

  try {
    await prisma.user.update({
      where: { id: currentUserId },
      data: validatedFields.data,
    });
    return {
      success: true,
      error: false,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
    };
  }
};

export const switchLike = async (postId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  try {
    const isLiked = await prisma.like.findFirst({
      where: { postId, userId },
    });
    if (!isLiked) {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    } else {
      await prisma.like.delete({
        where: { id: isLiked.id },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addComment = async (postId: number, desc: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  try {
    const createdComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        desc,
      },
      include: {
        user: true,
      },
    });
    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (desc: string, imgUrl: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  const Desc = z.string().min(1).max(255);
  const validatedDesc = Desc.safeParse(desc);
  if (!validatedDesc.success) {
    throw new Error(
      "Description is required and should be between 1 and 255 characters long."
    );
  }
  try {
    const createdPost = await prisma.post.create({
      data: {
        userId,
        desc: validatedDesc.data,
        ...(imgUrl ? { img: imgUrl } : {}),
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

export const deletePost = async (id: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  try {
    await prisma.post.delete({
      where: { id, userId },
    });
    revalidatePath("/");
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

export const deleteRepost = async (id: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  try {
    await prisma.sharedPost.delete({
      where: { id, userId },
    });
    revalidatePath("/");
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });
    if (existingStory) {
      await prisma.story.delete({
        where: { id: existingStory.id },
      });
    }
    const addedStory = await prisma.story.create({
      data: {
        userId,
        img,
        createdAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      include: {
        user: true,
      },
    });
    return addedStory;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};


export const sharePost = async (desc: string, postId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not Authenticated!");
  const Desc = z.string().min(0).max(255);
  const validatedDesc = Desc.safeParse(desc);
  if (!validatedDesc.success) {
    throw new Error(
      "Description is more than 255 characters long."
    );
  }
  try {
    const createdPost = await prisma.sharedPost.create({
      data: {
        userId,
        postId,
        desc: validatedDesc.data,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};
