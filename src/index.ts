import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { jwtHelper } from "./helpers/jwtHelpers";

const prisma = new PrismaClient();

interface IContext {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo:
    | {
        id: string | null;
        email: string | null;
      }
    | null
    | undefined;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const main = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<IContext> => {
      const userInfo = await jwtHelper.decodedToken(
        req.headers.authorization as string
      );
      // console.log(userInfo);

      return {
        prisma,
        userInfo,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
