import { Router } from 'express';
import { CategoryController, TagController } from './category.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const categoryController = new CategoryController();
const tagController = new TagController();

// Category routes
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.get('/categories/slug/:slug', categoryController.getCategoryBySlug);
router.post('/categories', authenticateToken, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, categoryController.deleteCategory);

// Tag routes
router.get('/tags', tagController.getTags);
router.get('/tags/:id', tagController.getTagById);
router.get('/tags/slug/:slug', tagController.getTagBySlug);
router.post('/tags', authenticateToken, tagController.createTag);
router.put('/tags/:id', authenticateToken, tagController.updateTag);
router.delete('/tags/:id', authenticateToken, tagController.deleteTag);

export default router;