import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelper } from "../../helpers/jwtHelpers";
import { authResolvers } from "./auth";
import { postResovers } from "./post";

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
export const Mutation = {
  ...authResolvers,
  ...postResovers,
};
