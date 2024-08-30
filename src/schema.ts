export const typeDefs = `
type Post {
  id: ID!
  title: String!
  content: String!
  author: User
  published: Boolean!
  createdAt: String!
}

type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post]
    
}

type Profile {
    id: Int!
    bio: String!
    createdAt: String!
    user: User!
}

type Mutation {
    signUp(name: String!, email: String!, password: String!): User
}

type Query {
  posts: [Post]
  post(id: ID!): Post
  me(id: ID!): User
  users: [User]

}
`;
