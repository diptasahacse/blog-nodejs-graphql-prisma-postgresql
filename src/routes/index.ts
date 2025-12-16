import { Router } from 'express';
import { userRoutes } from '../modules/user';
import { blogRoutes } from '../modules/blog';
import { commentRoutes } from '../modules/comment';
import { categoryRoutes } from '../modules/category';

const router = Router();

// API routes
router.use('/auth', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/categories', categoryRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    message: 'Blog API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

export default router;