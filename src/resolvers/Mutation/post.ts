import { error } from "console";
import { checkUserAccess } from "../../utils/checkUserAccess";

export const postResovers = {
  createPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    // console.log(userInfo);
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
    // console.log(newPost);

    return {
      message: "Post create successfully!",
      post: newPost,
    };
  },
  updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    // console.log(userInfo, "sdf");
    const postUpdateData = args.post;
    if (!userInfo) {
      return {
        message: "Unauthorized!=>",
        post: null,
      };
    }

    const userAccessError = await checkUserAccess(
      prisma,
      userInfo.id,
      args.postId
    );

    if (userAccessError) {
      return userAccessError;
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
  deletePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        message: "Unauthorized!=>",
        post: null,
      };
    }

    const userAccessError = await checkUserAccess(
      prisma,
      userInfo.id,
      args.postId
    );

    if (userAccessError) {
      return userAccessError;
    }

    const deletePost = await prisma.post.delete({
      where: {
        id: args.postId,
      },
    });

    return {
      message: "Post delete successfully!",
      post: deletePost,
    };
  },
  publishedPost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        message: "Unauthorized!=>",
        post: null,
      };
    }

    const userAccessError = await checkUserAccess(
      prisma,
      userInfo.id,
      args.postId
    );

    if (userAccessError) {
      return userAccessError;
    }

    const publishedPost = await prisma.post.update({
      where: {
        id: args.postId,
      },
      data: {
        published: true,
      },
    });

    return {
      message: "Post published successfully!",
      post: publishedPost,
    };
  },
};
