export const blogTypeDefs = `#graphql
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

  type Like {
    id: ID!
    createdAt: DateTime!
    user: User!
    blog: Blog!
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

  input BlogFilters {
    search: String
    categoryId: ID
    tagIds: [ID!]
    authorId: ID
    status: BlogStatus
    published: Boolean
  }

  type BlogConnection {
    data: [Blog!]!
    pagination: PaginationInfo!
  }

  extend type Query {
    # Blog queries
    blog(id: ID!): Blog
    blogBySlug(slug: String!): Blog
    blogs(filters: BlogFilters, pagination: PaginationInput): BlogConnection!
    myBlogs(pagination: PaginationInput): BlogConnection!
  }

  extend type Mutation {
    # Blog mutations
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(id: ID!, input: UpdateBlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
    toggleLike(blogId: ID!): Blog!
  }
`;