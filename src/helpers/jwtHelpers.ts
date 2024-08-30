import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";

export const generateToken = (
  jwtPayload: JwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
  return token;
};
