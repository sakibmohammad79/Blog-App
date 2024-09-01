export const checkUserAccess = async (
  prisma: any,
  userId: string,
  postId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      message: "User not found!",
      post: null,
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  // console.log(postData, "post");
  if (!post) {
    return {
      message: "Post not found!",
      post: null,
    };
  }

  if (post.authorId !== user.id) {
    return {
      message: "Post not owned by user!",
      post: null,
    };
  }
};
