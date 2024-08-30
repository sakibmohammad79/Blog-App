import jwt, { JwtPayload } from "jsonwebtoken";

export const generateToken = (jwtPayload: JwtPayload) => {
  const token = jwt.sign(jwtPayload, "signature", {
    expiresIn: "1d",
  });
  return token;
};
