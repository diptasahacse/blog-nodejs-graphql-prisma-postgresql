export const typeDefs = `#graphql
  scalar DateTime

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

  type Category {
    id: ID!
    name: String!
    description: String
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    blogs: [Blog!]!
    blogCount: Int!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    blogs: [Blog!]!
    blogCount: Int!
  }

  enum BlogStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type Blog {
    id: ID!
    title: String!
    slug: String!
    content: String!
    excerpt: String
    featuredImage: String
    status: BlogStatus!
    published: Boolean!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    author: User!
    category: Category
    tags: [Tag!]!
    comments: [Comment!]!
    likes: [Like!]!
    commentCount: Int!
    likeCount: Int!
    isLikedByUser: Boolean
  }

  enum CommentStatus {
    PENDING
    APPROVED
    REJECTED
  }

  type Comment {
    id: ID!
    content: String!
    status: CommentStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    author: User!
    blog: Blog!
    parent: Comment
    replies: [Comment!]!
    replyCount: Int!
  }

  type Like {
    id: ID!
    createdAt: DateTime!
    user: User!
    blog: Blog!
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

  input CreateBlogInput {
    title: String!
    content: String!
    excerpt: String
    featuredImage: String
    categoryId: ID
    tagIds: [ID!]
    published: Boolean
  }

  input UpdateBlogInput {
    title: String
    content: String
    excerpt: String
    featuredImage: String
    categoryId: ID
    tagIds: [ID!]
    status: BlogStatus
    published: Boolean
  }

  input CreateCommentInput {
    content: String!
    blogId: ID!
    parentId: ID
  }

  input CreateCategoryInput {
    name: String!
    description: String
  }

  input CreateTagInput {
    name: String!
  }

  input BlogFilters {
    search: String
    categoryId: ID
    tagIds: [ID!]
    authorId: ID
    status: BlogStatus
    published: Boolean
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    total: Int!
    pages: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  type BlogConnection {
    data: [Blog!]!
    pagination: PaginationInfo!
  }

  type CommentConnection {
    data: [Comment!]!
    pagination: PaginationInfo!
  }

  type UserConnection {
    data: [User!]!
    pagination: PaginationInfo!
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    userByUsername(username: String!): User
    users(pagination: PaginationInput): UserConnection!

    # Blog queries
    blog(id: ID!): Blog
    blogBySlug(slug: String!): Blog
    blogs(filters: BlogFilters, pagination: PaginationInput): BlogConnection!
    myBlogs(pagination: PaginationInput): BlogConnection!

    # Comment queries
    comment(id: ID!): Comment
    comments(blogId: ID, authorId: ID, status: CommentStatus, pagination: PaginationInput): CommentConnection!
    commentsByBlog(blogId: ID!, pagination: PaginationInput): CommentConnection!

    # Category & Tag queries
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category
    categories: [Category!]!
    tag(id: ID!): Tag
    tagBySlug(slug: String!): Tag
    tags: [Tag!]!
  }

  type Mutation {
    # Auth mutations
    register(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): Profile!

    # Blog mutations
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(id: ID!, input: UpdateBlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
    toggleLike(blogId: ID!): Blog!

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    updateCommentStatus(id: ID!, status: CommentStatus!): Comment!
    deleteComment(id: ID!): Boolean!

    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: CreateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    # Tag mutations
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: CreateTagInput!): Tag!
    deleteTag(id: ID!): Boolean!
  }
`;