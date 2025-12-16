import { Router } from 'express';
import { BlogController } from './blog.controller';
import { authenticateToken, optionalAuth } from '../../middleware/auth';

const router = Router();
const blogController = new BlogController();

// Protected routes (must come before parameterized routes)
router.get('/my/blogs', authenticateToken, blogController.getMyBlogs);

// Public routes
router.get('/', optionalAuth, blogController.getBlogs);
router.get('/slug/:slug', optionalAuth, blogController.getBlogBySlug);
router.get('/:id', optionalAuth, blogController.getBlogById);

// Protected routes
router.post('/', authenticateToken, blogController.createBlog);
router.put('/:id', authenticateToken, blogController.updateBlog);
router.delete('/:id', authenticateToken, blogController.deleteBlog);
router.post('/:id/like', authenticateToken, blogController.toggleLike);

export default router;