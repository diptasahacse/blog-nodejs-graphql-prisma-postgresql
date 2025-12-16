import { Router } from 'express';
import authRoutes from './auth.routes';
import blogRoutes from './blog.routes';
import commentRoutes from './comment.routes';
import metadataRoutes from './metadata.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/metadata', metadataRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    message: 'Blog API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

export default router;