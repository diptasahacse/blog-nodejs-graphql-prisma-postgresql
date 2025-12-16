import { DateTimeResolver } from 'graphql-scalars';
import { UserService } from '../../services/user.service';
import { BlogService } from '../../services/blog.service';
import { CommentService } from '../../services/comment.service';
import { CategoryService, TagService } from '../../services/category.service';
import type { AuthPayload } from '../../types';

const userService = new UserService();
const blogService = new BlogService();
const commentService = new CommentService();
const categoryService = new CategoryService();
const tagService = new TagService();

export interface GraphQLContext {
  user?: AuthPayload;
}

export const resolvers = {
  DateTime: DateTimeResolver,

  Query: {
    // User queries
    me: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return userService.getUserById(context.user.id);
    },

    user: async (_: any, { id }: { id: string }) => {
      return userService.getUserById(id);
    },

    userByUsername: async (_: any, { username }: { username: string }) => {
      return userService.getUserByUsername(username);
    },

    users: async (_: any, { pagination }: { pagination?: any }) => {
      return userService.getUsers(pagination || {});
    },

    // Blog queries
    blog: async (_: any, { id }: { id: string }) => {
      return blogService.getBlogById(id);
    },

    blogBySlug: async (_: any, { slug }: { slug: string }) => {
      return blogService.getBlogBySlug(slug);
    },

    blogs: async (_: any, { filters, pagination }: { filters?: any; pagination?: any }) => {
      return blogService.getBlogs(filters || {}, pagination || {});
    },

    myBlogs: async (_: any, { pagination }: { pagination?: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return blogService.getBlogs({ authorId: context.user.id }, pagination || {});
    },

    // Comment queries
    comment: async (_: any, { id }: { id: string }) => {
      return commentService.getCommentById(id);
    },

    comments: async (_: any, { blogId, authorId, status, pagination }: any) => {
      return commentService.getComments({ blogId, authorId, status }, pagination || {});
    },

    commentsByBlog: async (_: any, { blogId, pagination }: { blogId: string; pagination?: any }) => {
      return commentService.getCommentsByBlog(blogId, pagination || {});
    },

    // Category & Tag queries
    category: async (_: any, { id }: { id: string }) => {
      return categoryService.getCategoryById(id);
    },

    categoryBySlug: async (_: any, { slug }: { slug: string }) => {
      return categoryService.getCategoryBySlug(slug);
    },

    categories: async () => {
      return categoryService.getCategories();
    },

    tag: async (_: any, { id }: { id: string }) => {
      return tagService.getTagById(id);
    },

    tagBySlug: async (_: any, { slug }: { slug: string }) => {
      return tagService.getTagBySlug(slug);
    },

    tags: async () => {
      return tagService.getTags();
    },
  },

  Mutation: {
    // Auth mutations
    register: async (_: any, { input }: { input: any }) => {
      return userService.createUser(input);
    },

    login: async (_: any, { input }: { input: any }) => {
      return userService.loginUser(input.email, input.password);
    },

    updateProfile: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return userService.updateProfile(context.user.id, input);
    },

    // Blog mutations
    createBlog: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return blogService.createBlog(context.user.id, input);
    },

    updateBlog: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingBlog = await blogService.getBlogById(id);
      if (!existingBlog || existingBlog.authorId !== context.user.id) {
        throw new Error('Not authorized to update this blog');
      }

      return blogService.updateBlog(id, input);
    },

    deleteBlog: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
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

    toggleLike: async (_: any, { blogId }: { blogId: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      await blogService.toggleLike(context.user.id, blogId);
      return blogService.getBlogById(blogId);
    },

    // Comment mutations
    createComment: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return commentService.createComment(context.user.id, input);
    },

    updateComment: async (_: any, { id, content }: { id: string; content: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingComment = await commentService.getCommentById(id);
      if (!existingComment || existingComment.authorId !== context.user.id) {
        throw new Error('Not authorized to update this comment');
      }

      return commentService.updateComment(id, content);
    },

    updateCommentStatus: async (_: any, { id, status }: { id: string; status: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      // Note: In a real app, you'd want to check for admin permissions here
      return commentService.updateCommentStatus(id, status);
    },

    deleteComment: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingComment = await commentService.getCommentById(id);
      if (!existingComment || existingComment.authorId !== context.user.id) {
        throw new Error('Not authorized to delete this comment');
      }

      await commentService.deleteComment(id);
      return true;
    },

    // Category mutations
    createCategory: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return categoryService.createCategory(input);
    },

    updateCategory: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return categoryService.updateCategory(id, input);
    },

    deleteCategory: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      await categoryService.deleteCategory(id);
      return true;
    },

    // Tag mutations
    createTag: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return tagService.createTag(input);
    },

    updateTag: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return tagService.updateTag(id, input);
    },

    deleteTag: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      await tagService.deleteTag(id);
      return true;
    },
  },

  // Field resolvers
  User: {
    blogCount: async (parent: any) => {
      return parent._count?.blogs || 0;
    },
    commentCount: async (parent: any) => {
      return parent._count?.comments || 0;
    },
    likeCount: async (parent: any) => {
      return parent._count?.likes || 0;
    },
  },

  Blog: {
    commentCount: async (parent: any) => {
      return parent._count?.comments || 0;
    },
    likeCount: async (parent: any) => {
      return parent._count?.likes || 0;
    },
    isLikedByUser: async (parent: any, _: any, context: GraphQLContext) => {
      if (!context.user) return false;
      // This would need to be optimized in a real app
      const likes = parent.likes || [];
      return likes.some((like: any) => like.userId === context.user!.id);
    },
    tags: async (parent: any) => {
      return parent.tags?.map((blogTag: any) => blogTag.tag) || [];
    },
  },

  Category: {
    blogCount: async (parent: any) => {
      return parent._count?.blogs || 0;
    },
  },

  Tag: {
    blogCount: async (parent: any) => {
      return parent._count?.blogs || 0;
    },
  },

  Comment: {
    replyCount: async (parent: any) => {
      return parent.replies?.length || parent._count?.replies || 0;
    },
  },
};