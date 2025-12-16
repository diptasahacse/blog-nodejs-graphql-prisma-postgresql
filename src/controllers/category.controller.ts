import { Request, Response, NextFunction } from 'express';
import { CategoryService, TagService } from '../services/category.service';
import { createCategorySchema, createTagSchema } from '../utils/validation';

const categoryService = new CategoryService();
const tagService = new TagService();

export class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await categoryService.createCategory(validatedData);
      
      res.status(201).json({
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategories();
      
      res.json({
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createCategorySchema.partial().parse(req.body);
      
      const category = await categoryService.updateCategory(id, validatedData);
      
      res.json({
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      
      res.json({
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export class TagController {
  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createTagSchema.parse(req.body);
      const tag = await tagService.createTag(validatedData);
      
      res.status(201).json({
        message: 'Tag created successfully',
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tag = await tagService.getTagById(id);
      
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      
      res.json({
        message: 'Tag retrieved successfully',
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTagBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const tag = await tagService.getTagBySlug(slug);
      
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      
      res.json({
        message: 'Tag retrieved successfully',
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getTags();
      
      res.json({
        message: 'Tags retrieved successfully',
        data: tags,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createTagSchema.partial().parse(req.body);
      
      const tag = await tagService.updateTag(id, validatedData);
      
      res.json({
        message: 'Tag updated successfully',
        data: tag,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await tagService.deleteTag(id);
      
      res.json({
        message: 'Tag deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}