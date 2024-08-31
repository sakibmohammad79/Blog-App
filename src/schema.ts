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
    id: ID!
    bio: String
    createdAt: String!
    user: User!
}

type AuthPayload {
    token: String
    message: String
}

type PostPayload {
    message: String
    post: Post
}

type Mutation {
    signUp(
        name: String!,
        email: String!,
        password: String!
        bio: String
    ): AuthPayload,

    logIn(password: String!, email: String!): AuthPayload,

    createPost(post: PostInput!): PostPayload,
    updatePost(postId: ID!, post: PostInput!): PostPayload
}

input PostInput {
    title: String
    content: String
}

type Query {
  posts: [Post]
  post(id: ID!): Post
  me(id: ID!): User
  users: [User]
  myProfile(id: ID!): Profile
}`;
