import { BlogService } from './blog.service';
import type { GraphQLContext } from '../../graphql/resolvers';
import type { 
  BlogArgs, 
  BlogBySlugArgs, 
  BlogsArgs, 
  MyBlogsArgs, 
  CreateBlogArgs, 
  UpdateBlogArgs, 
  DeleteBlogArgs, 
  ToggleLikeArgs,
  BlogParent
} from '../../types';

const blogService = new BlogService();

export const blogResolvers = {
  Query: {
    blog: async (_parent: unknown, { id }: BlogArgs) => {
      return blogService.getBlogById(id);
    },

    blogBySlug: async (_parent: unknown, { slug }: BlogBySlugArgs) => {
      return blogService.getBlogBySlug(slug);
    },

    blogs: async (_parent: unknown, { filters, pagination }: BlogsArgs) => {
      return blogService.getBlogs(filters || {}, pagination || {});
    },

    myBlogs: async (_parent: unknown, { pagination }: MyBlogsArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return blogService.getBlogs({ authorId: context.user.id }, pagination || {});
    },
  },

  Mutation: {
    createBlog: async (_parent: unknown, { input }: CreateBlogArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return blogService.createBlog(context.user.id, input);
    },

    updateBlog: async (_parent: unknown, { id, input }: UpdateBlogArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingBlog = await blogService.getBlogById(id);
      if (!existingBlog || existingBlog.authorId !== context.user.id) {
        throw new Error('Not authorized to update this blog');
      }

      return blogService.updateBlog(id, input);
    },

    deleteBlog: async (_parent: unknown, { id }: DeleteBlogArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingBlog = await blogService.getBlogById(id);
      if (!existingBlog || existingBlog.authorId !== context.user.id) {
        throw new Error('Not authorized to delete this blog');
      }

      await blogService.deleteBlog(id);
      return true;
    },

    toggleLike: async (_parent: unknown, { blogId }: ToggleLikeArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      await blogService.toggleLike(context.user.id, blogId);
      return blogService.getBlogById(blogId);
    },
  },

  Blog: {
    commentCount: (parent: BlogParent): number => {
      return parent._count?.comments || 0;
    },
    likeCount: (parent: BlogParent): number => {
      return parent._count?.likes || 0;
    },
    isLikedByUser: (parent: BlogParent, _args: unknown, context: GraphQLContext): boolean => {
      if (!context.user) return false;
      const likes = parent.likes || [];
      return likes.some((like) => like.userId === context.user!.id);
    },
    tags: (parent: { tags?: Array<{ tag: unknown }> }) => {
      return parent.tags?.map((blogTag) => blogTag.tag) || [];
    },
  },
};