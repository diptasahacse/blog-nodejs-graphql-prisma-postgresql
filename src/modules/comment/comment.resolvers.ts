import { CommentService } from './comment.service';
import type { GraphQLContext } from '../../graphql/resolvers';
import type { 
  CommentArgs, 
  CommentsArgs, 
  CommentsByBlogArgs, 
  CreateCommentArgs, 
  UpdateCommentArgs, 
  UpdateCommentStatusArgs, 
  DeleteCommentArgs,
  CommentParent
} from '../../types';

const commentService = new CommentService();

export const commentResolvers = {
  Query: {
    comment: async (_parent: unknown, { id }: CommentArgs) => {
      return commentService.getCommentById(id);
    },

    comments: async (_parent: unknown, { blogId, authorId, status, pagination }: CommentsArgs) => {
      return commentService.getComments({ blogId, authorId, status }, pagination || {});
    },

    commentsByBlog: async (_parent: unknown, { blogId, pagination }: CommentsByBlogArgs) => {
      return commentService.getCommentsByBlog(blogId, pagination || {});
    },
  },

  Mutation: {
    createComment: async (_parent: unknown, { input }: CreateCommentArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return commentService.createComment(context.user.id, input);
    },

    updateComment: async (_parent: unknown, { id, content }: UpdateCommentArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingComment = await commentService.getCommentById(id);
      if (!existingComment || existingComment.authorId !== context.user.id) {
        throw new Error('Not authorized to update this comment');
      }

      return commentService.updateComment(id, content);
    },

    updateCommentStatus: async (_parent: unknown, { id, status }: UpdateCommentStatusArgs, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return commentService.updateCommentStatus(id, status);
    },

    deleteComment: async (_parent: unknown, { id }: DeleteCommentArgs, context: GraphQLContext) => {
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
  },

  Comment: {
    replyCount: (parent: CommentParent): number => {
      return parent.replies?.length || parent._count?.replies || 0;
    },
  },
};