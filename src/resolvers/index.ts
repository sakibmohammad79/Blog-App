import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { generateToken } from "../helpers/jwtHelpers";
import config from "../config";

const prisma = new PrismaClient();

interface ISignUpInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
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
    myProfile: async (parent: any, args: any, context: any) => {
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

      if (args.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: createUser.id,
          },
        });
      }
      //generate token
      const jwtPayload = {
        id: createUser.id,
        email: createUser.email,
      };
      const token = generateToken(
        jwtPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
      );
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
      const token = generateToken(
        jwtPayload,
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
      );
      return {
        token,
        message: "User login successfully!",
      };
    },
    createPost: async (parent: any, args: any, context: any) => {
      const newPost = await prisma.post.create({
        data: args,
      });

      return newPost;
    },
  },
};
