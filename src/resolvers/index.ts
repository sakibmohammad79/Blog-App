import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {},
  Mutation: {
    signUp: async (
      parent: any,
      args: { name: string; email: string; password: string },
      context: any
    ) => {
      console.log(args);
      const createUser = await prisma.user.create({
        data: args,
      });
      return createUser;
    },
  },
};
