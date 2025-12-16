import { scalarTypeDefs } from './scalars';
import { commonTypeDefs } from './common';
import { userTypeDefs } from './user';
import { blogTypeDefs } from './blog';
import { commentTypeDefs } from './comment';
import { categoryTypeDefs } from './category';

export const typeDefs = [
  scalarTypeDefs,
  commonTypeDefs,
  userTypeDefs,
  blogTypeDefs,
  commentTypeDefs,
  categoryTypeDefs,
];