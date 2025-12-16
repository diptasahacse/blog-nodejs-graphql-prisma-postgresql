import { UserService } from './user.service';
import type { GraphQLContext } from '../../graphql/resolvers';
import type { 
  UserArgs, 
  UserByUsernameArgs, 
  UsersArgs, 
  RegisterArgs, 
  LoginArgs, 
  UpdateProfileArgs,
  UserParent
} from '../../types';

const userService = new UserService();

export const userResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return userService.getUserById(context.user.id);
    },

    user: async (_parent: unknown, { id }: UserArgs) => {
      return userService.getUserById(id);
    },

    userByUsername: async (_parent: unknown, { username }: UserByUsernameArgs) => {
      return userService.getUserByUsername(username);
    },

    users: async (_parent: unknown, { pagination }: UsersArgs) => {
      return userService.getUsers(pagination || {});
    },
  },

  Mutation: {
    register: async (_parent: unknown, { input }: RegisterArgs) => {
      return userService.createUser(input);
    },

    login: async (_parent: unknown, { input }: LoginArgs) => {
      return userService.loginUser(input.email, input.password);
    },

    updateProfile: async (_parent: unknown, { input }: UpdateProfileArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return userService.updateProfile(context.user.id, input);
    },
  },

  User: {
    blogCount: (parent: UserParent): number => {
      return parent._count?.blogs || 0;
    },
    commentCount: (parent: UserParent): number => {
      return parent._count?.comments || 0;
    },
    likeCount: (parent: UserParent): number => {
      return parent._count?.likes || 0;
    },
  },
};