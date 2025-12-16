import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';
import { createCommentSchema, paginationSchema } from '../utils/validation';

const commentService = new CommentService();

export class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.user!.id;
      const validatedData = createCommentSchema.parse(req.body);
      
      const comment = await commentService.createComment(authorId, validatedData);
      
      res.status(201).json({
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCommentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comment = await commentService.getCommentById(id);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      res.json({
        message: 'Comment retrieved successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = paginationSchema.parse({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      
      const filters = {
        blogId: req.query.blogId as string,
        authorId: req.query.authorId as string,
        status: req.query.status as 'PENDING' | 'APPROVED' | 'REJECTED',
        parentId: req.query.parentId === 'null' ? null : req.query.parentId as string,
      };
      
      const result = await commentService.getComments(filters, pagination);
      
      res.json({
        message: 'Comments retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCommentsByBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogId } = req.params;
      const pagination = paginationSchema.parse({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      
      const result = await commentService.getCommentsByBlog(blogId, pagination);
      
      res.json({
        message: 'Comments retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      // Check if user owns the comment
      const existingComment = await commentService.getCommentById(id);
      if (!existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (existingComment.authorId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized to update this comment' });
      }
      
      const comment = await commentService.updateComment(id, content);
      
      res.json({
        message: 'Comment updated successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCommentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const comment = await commentService.updateCommentStatus(id, status);
      
      res.json({
        message: 'Comment status updated successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Check if user owns the comment
      const existingComment = await commentService.getCommentById(id);
      if (!existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (existingComment.authorId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized to delete this comment' });
      }
      
      await commentService.deleteComment(id);
      
      res.json({
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}