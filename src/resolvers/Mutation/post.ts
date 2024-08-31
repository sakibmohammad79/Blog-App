export const postResovers = {
  createPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        message: "Unauthorized!",
        post: null,
      };
    }
    if (!post.title || !post.content) {
      return {
        message: "Title and content is required!",
        post: null,
      };
    }
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.id,
      },
    });
    console.log(newPost);

    return {
      message: "Post create successfully!",
      post: newPost,
    };
  },
  updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    const postUpdateData = args.post;
    if (!userInfo) {
      return {
        message: "Unauthorized!",
        post: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.id,
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
        id: args.postId,
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

    const updatePost = await prisma.post.update({
      where: {
        id: args.postId,
      },
      data: postUpdateData,
    });

    return {
      message: "Post update successfully!",
      post: updatePost,
    };
  },
};
