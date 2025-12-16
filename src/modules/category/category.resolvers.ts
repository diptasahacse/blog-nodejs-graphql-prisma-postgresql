import { CategoryService, TagService } from './category.service';
import type { GraphQLContext } from '../../graphql/resolvers';
import type {
  CategoryArgs,
  CategoryBySlugArgs,
  CreateCategoryArgs,
  UpdateCategoryArgs,
  DeleteCategoryArgs,
  TagArgs,
  TagBySlugArgs,
  CreateTagArgs,
  UpdateTagArgs,
  DeleteTagArgs,
  CategoryParent,
  TagParent
} from '../../types';

const categoryService = new CategoryService();
const tagService = new TagService();

export const categoryResolvers = {
  Query: {
    category: async (_parent: unknown, { id }: CategoryArgs) => {
      return categoryService.getCategoryById(id);
    },

    categoryBySlug: async (_parent: unknown, { slug }: CategoryBySlugArgs) => {
      return categoryService.getCategoryBySlug(slug);
    },

    categories: async () => {
      return categoryService.getCategories();
    },

    tag: async (_parent: unknown, { id }: TagArgs) => {
      return tagService.getTagById(id);
    },

    tagBySlug: async (_parent: unknown, { slug }: TagBySlugArgs) => {
      return tagService.getTagBySlug(slug);
    },

    tags: async () => {
      return tagService.getTags();
    },
  },

  Mutation: {
    createCategory: async (_parent: unknown, { input }: CreateCategoryArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return categoryService.createCategory(input);
    },

    updateCategory: async (_parent: unknown, { id, input }: UpdateCategoryArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return categoryService.updateCategory(id, input);
    },

    deleteCategory: async (_parent: unknown, { id }: DeleteCategoryArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      await categoryService.deleteCategory(id);
      return true;
    },

    createTag: async (_parent: unknown, { input }: CreateTagArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return tagService.createTag(input);
    },

    updateTag: async (_parent: unknown, { id, input }: UpdateTagArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return tagService.updateTag(id, input);
    },

    deleteTag: async (_parent: unknown, { id }: DeleteTagArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      await tagService.deleteTag(id);
      return true;
    },
  },

  Category: {
    blogCount: (parent: CategoryParent): number => {
      return parent._count?.blogs || 0;
    },
  },

  Tag: {
    blogCount: (parent: TagParent): number => {
      return parent._count?.blogs || 0;
    },
  },
};