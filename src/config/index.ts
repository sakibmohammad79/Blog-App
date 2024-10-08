import path from "path";

require("dotenv").config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
};
