import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelper } from "../../helpers/jwtHelpers";

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
export const authResolvers = {
  signUp: async (parent: any, args: ISignUpInfo, context: any) => {
    const { prisma } = context;
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
    const token = await jwtHelper.generateToken(
      jwtPayload,
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    return {
      token,
      message: "User created successfully!",
    };
  },
  logIn: async (parent: any, args: ILogInInfo, { prisma }: any) => {
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
    const token = await jwtHelper.generateToken(
      jwtPayload,
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    return {
      token,
      message: "User login successfully!",
    };
  },
};
