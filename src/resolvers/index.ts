import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface IUserInfo {
  name: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
    me: async (parent: any, args: any, context: any) => {
      console.log(args);
      const id = Number(args.id);
      return await prisma.user.findUnique({
        where: {
          id,
        },
      });
    },
  },
  Mutation: {
    signUp: async (parent: any, args: IUserInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const createUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      //generate token
      const jwtPayload = {
        id: createUser.id,
        email: createUser.email,
      };
      const token = jwt.sign(jwtPayload, "signature", {
        expiresIn: "1d",
      });
      return {
        token,
        message: "User created successfully!",
      };
    },
  },
};
