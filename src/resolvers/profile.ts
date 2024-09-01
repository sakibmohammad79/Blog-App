export const Profile = {
  user: async (parent: any, args: any, { prisma }: any) => {
    console.log(parent);
    return await prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
};
