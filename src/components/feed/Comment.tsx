import { Comment as CommentSchema, User } from "@prisma/client";
import prisma from "@/lib/client";
import CommentList from "./CommentList";

type CommentDataType = CommentSchema & {
  user: User;
};

const Comment = async ({ postId }: { postId: number }) => {
  let commentsData: CommentDataType[] = [];
  try {
    commentsData = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return (
    <section>
      <CommentList postId={postId} commentsData={commentsData} />
    </section>
  );
};

export default Comment;
