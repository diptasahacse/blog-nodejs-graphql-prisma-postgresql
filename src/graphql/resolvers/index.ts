import { DateTimeResolver } from 'graphql-scalars';
import { userResolvers } from '../../modules/user';
import { blogResolvers } from '../../modules/blog';
import { commentResolvers } from '../../modules/comment';
import { categoryResolvers } from '../../modules/category';
import type { AuthPayload } from '../../types';

export interface GraphQLContext {
  user?: AuthPayload;
}

export const resolvers = {
  DateTime: DateTimeResolver,

  Query: {
    ...userResolvers.Query,
    ...blogResolvers.Query,
    ...commentResolvers.Query,
    ...categoryResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...blogResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...categoryResolvers.Mutation,
  },

  User: userResolvers.User,
  Blog: blogResolvers.Blog,
  Comment: commentResolvers.Comment,
  Category: categoryResolvers.Category,
  Tag: categoryResolvers.Tag,
};