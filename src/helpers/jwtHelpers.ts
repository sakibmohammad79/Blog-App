import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";
const generateToken = async (
  jwtPayload: JwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
  return token;
};

const decodedToken = async (token: string) => {
  try {
    const userInfo = jwt.verify(token, config.jwt.secret as string) as {
      id: string;
      email: string;
    };
    return userInfo;
  } catch (err) {
    console.error("Token verification failed:", err);
    console.log(err);
  }
};

export const jwtHelper = {
  generateToken,
  decodedToken,
};
