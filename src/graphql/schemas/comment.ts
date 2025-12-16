export const commentTypeDefs = `#graphql
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

  input CreateCommentInput {
    content: String!
    blogId: ID!
    parentId: ID
  }

  type CommentConnection {
    data: [Comment!]!
    pagination: PaginationInfo!
  }

  extend type Query {
    # Comment queries
    comment(id: ID!): Comment
    comments(blogId: ID, authorId: ID, status: CommentStatus, pagination: PaginationInput): CommentConnection!
    commentsByBlog(blogId: ID!, pagination: PaginationInput): CommentConnection!
  }

  extend type Mutation {
    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    updateCommentStatus(id: ID!, status: CommentStatus!): Comment!
    deleteComment(id: ID!): Boolean!
  }
`;