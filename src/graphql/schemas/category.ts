export const categoryTypeDefs = `#graphql
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

  input CreateCategoryInput {
    name: String!
    description: String
  }

  input CreateTagInput {
    name: String!
  }

  extend type Query {
    # Category & Tag queries
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category
    categories: [Category!]!
    tag(id: ID!): Tag
    tagBySlug(slug: String!): Tag
    tags: [Tag!]!
  }

  extend type Mutation {
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