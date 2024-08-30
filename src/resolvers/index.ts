import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../helpers/jwtHelpers";

const prisma = new PrismaClient();

interface ISignUpInfo {
  name: string;
  email: string;
  password: string;
}
interface ILogInInfo {
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
    signUp: async (parent: any, args: ISignUpInfo, context: any) => {
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (user) {
        return {
          message: "This user already exists!",
        };
      }
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
      const token = generateToken(jwtPayload);
      return {
        token,
        message: "User created successfully!",
      };
    },
    logIn: async (parent: any, args: ILogInInfo, context: any) => {
      //check user is exists
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (!user) {
        return {
          token: null,
          message: "User not found!",
        };
      }
      //check password is correct
      const isPasswordCorrect = await bcrypt.compare(
        args.password,
        user.password
      );
      if (!isPasswordCorrect) {
        return {
          token: null,
          message: "Incorrect password!",
        };
      }
      const jwtPayload = {
        id: user.id,
        email: user.email,
      };
      const token = generateToken(jwtPayload);
      return {
        token,
        message: "User login successfully!",
      };
    },
  },
};
