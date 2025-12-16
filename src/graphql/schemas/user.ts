export const userTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    profile: Profile
    blogs: [Blog!]!
    comments: [Comment!]!
    blogCount: Int!
    commentCount: Int!
    likeCount: Int!
  }

  type Profile {
    id: ID!
    firstName: String
    lastName: String
    bio: String
    avatar: String
    website: String
    location: String
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateProfileInput {
    firstName: String
    lastName: String
    bio: String
    avatar: String
    website: String
    location: String
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    bio: String
    avatar: String
    website: String
    location: String
  }

  type UserConnection {
    data: [User!]!
    pagination: PaginationInfo!
  }

  extend type Query {
    # User queries
    me: User
    user(id: ID!): User
    userByUsername(username: String!): User
    users(pagination: PaginationInput): UserConnection!
  }

  extend type Mutation {
    # Auth mutations
    register(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): Profile!
  }
`;