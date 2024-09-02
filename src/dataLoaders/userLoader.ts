import { User } from "@prisma/client";
import { prisma } from "..";
import DataLoader from "dataloader";

const batchUsers = async (ids: string[]): Promise<User[]> => {
  //ids [23,2342,234]
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  //   console.log(users);

  /*
  1: {id: 1, name : "sakib"}
  2: {id: 1, name : "sakib"}
  3: {id: 1, name : "sakib"}
  5: {id: 1, name : "sakib"}
  4: {id: 1, name : "sakib"}
  */
  const userData: { [key: string]: User } = {};
  users.forEach((user) => {
    userData[user.id] = user;
  });

  console.log(userData);

  const data = ids.map((id) => userData[id]);
  //   console.log(data);
  return data;
};

//@ts-ignore
export const userLoader = new DataLoader<string, User>(batchUsers);
