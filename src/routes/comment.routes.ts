import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();
const commentController = new CommentController();

// Public routes
router.get('/', optionalAuth, commentController.getComments);
router.get('/blog/:blogId', optionalAuth, commentController.getCommentsByBlog);
router.get('/:id', optionalAuth, commentController.getCommentById);

// Protected routes
router.post('/', authenticateToken, commentController.createComment);
router.put('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);

// Admin routes (for now, anyone can moderate - you might want to add admin middleware)
router.patch('/:id/status', authenticateToken, commentController.updateCommentStatus);

export default router;