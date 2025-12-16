import { Request, Response, NextFunction } from 'express';
import { BlogService } from './blog.service';
import { 
  createBlogSchema, 
  updateBlogSchema, 
  paginationSchema, 
  blogFiltersSchema 
} from '../../utils/validation';

const blogService = new BlogService();

export class BlogController {
  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.user!.id;
      const validatedData = createBlogSchema.parse(req.body);
      
      const blog = await blogService.createBlog(authorId, validatedData);
      
      res.status(201).json({
        message: 'Blog created successfully',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateBlogSchema.parse(req.body);
      
      // Check if user owns the blog
      const existingBlog = await blogService.getBlogById(id);
      if (!existingBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      if (existingBlog.authorId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized to update this blog' });
      }
      
      const blog = await blogService.updateBlog(id, validatedData);
      
      res.json({
        message: 'Blog updated successfully',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blog = await blogService.getBlogById(id);
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      res.json({
        message: 'Blog retrieved successfully',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBlogBySlug(slug);
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      res.json({
        message: 'Blog retrieved successfully',
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = paginationSchema.parse({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      
      const filters = blogFiltersSchema.parse({
        search: req.query.search,
        categoryId: req.query.categoryId,
        tagIds: req.query.tagIds ? 
          (Array.isArray(req.query.tagIds) ? req.query.tagIds : [req.query.tagIds]) : undefined,
        authorId: req.query.authorId,
        status: req.query.status,
        published: req.query.published ? req.query.published === 'true' : undefined,
      });
      
      const result = await blogService.getBlogs(filters, pagination);
      
      res.json({
        message: 'Blogs retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.user!.id;
      const pagination = paginationSchema.parse({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      
      const filters = blogFiltersSchema.parse({
        ...req.query,
        authorId,
      });
      
      const result = await blogService.getBlogs(filters, pagination);
      
      res.json({
        message: 'Your blogs retrieved successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Check if user owns the blog
      const existingBlog = await blogService.getBlogById(id);
      if (!existingBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      if (existingBlog.authorId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized to delete this blog' });
      }
      
      await blogService.deleteBlog(id);
      
      res.json({
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Check if blog exists
      const blog = await blogService.getBlogById(id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      const result = await blogService.toggleLike(userId, id);
      
      res.json({
        message: result.liked ? 'Blog liked successfully' : 'Blog unliked successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}