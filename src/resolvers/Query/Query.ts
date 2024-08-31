export const Query = {
  users: async (parent: any, args: any, context: any) => {
    const { prisma } = context;
    return await prisma.user.findMany();
  },
  me: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  myProfile: async (parent: any, args: any, { prisma }: any) => {
    const isUserExists = await prisma.user.findUnique({
      where: { id: args.id },
    });

    if (!isUserExists) {
      return null; // If the user doesn't exist, return null for the entire Profile
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: isUserExists.id },
    });

    if (!userProfile) {
      return null; // If no profile exists, return null
    }

    // Ensure bio is not null
    if (!userProfile.bio) {
      userProfile.bio = "No bio available"; // Provide a default value
    }

    return userProfile;
  },
};
