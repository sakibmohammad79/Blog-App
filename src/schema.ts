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



type Mutation {
    signUp(
        name: String!,
        email: String!,
        password: String!
        bio: String
    ): AuthPayload,

    logIn(password: String!, email: String!): AuthPayload,

    createPost(post: PostInput!): PostPayload,

    updatePost(postId: ID!, post: PostInput!): PostPayload,

    deletePost(postId: ID!): PostPayload,

    publishedPost(postId: ID!): PostPayload,
}

type Query {
  posts: [Post]
  post(id: ID!): Post
  me: User
  users: [User]
  myProfile(userId: ID!): Profile
}

type AuthPayload {
    token: String
    message: String
}

type PostPayload {
    message: String
    post: Post
}

input PostInput {
    title: String
    content: String
}
`;
