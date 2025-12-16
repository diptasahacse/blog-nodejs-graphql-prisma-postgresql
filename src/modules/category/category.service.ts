import { prisma } from '../../config/database';
import { generateSlug } from '../../utils/helpers';
import type { CreateCategoryInput, UpdateCategoryInput, CreateTagInput, UpdateTagInput } from '../../types';

export class CategoryService {
  async createCategory(data: CreateCategoryInput) {
    const slug = generateSlug(data.name);
    
    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (await this.getCategoryBySlug(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return prisma.category.create({
      data: {
        ...data,
        slug: finalSlug,
      },
    });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });
  }

  async getCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    let updateData = { ...data };
    
    if (data.name) {
      const slug = generateSlug(data.name);
      let finalSlug = slug;
      let counter = 1;
      while (await this.getCategoryBySlug(finalSlug)) {
        const existingCategory = await this.getCategoryById(id);
        if (existingCategory?.slug === finalSlug) break;
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData = { ...updateData, slug: finalSlug } as UpdateCategoryInput & { slug: string };
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export class TagService {
  async createTag(data: CreateTagInput) {
    const slug = generateSlug(data.name);
    
    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (await this.getTagBySlug(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return prisma.tag.create({
      data: {
        ...data,
        slug: finalSlug,
      },
    });
  }

  async getTagById(id: string) {
    return prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });
  }

  async getTagBySlug(slug: string) {
    return prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });
  }

  async getTags() {
    return prisma.tag.findMany({
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateTag(id: string, data: UpdateTagInput) {
    let updateData = { ...data };
    
    if (data.name) {
      const slug = generateSlug(data.name);
      let finalSlug = slug;
      let counter = 1;
      while (await this.getTagBySlug(finalSlug)) {
        const existingTag = await this.getTagById(id);
        if (existingTag?.slug === finalSlug) break;
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData = { ...updateData, slug: finalSlug } as UpdateTagInput & { slug: string };
    }

    return prisma.tag.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTag(id: string) {
    return prisma.tag.delete({
      where: { id },
    });
  }

  async getOrCreateTags(tagNames: string[]) {
    const tags = [];
    
    for (const name of tagNames) {
      let tag = await prisma.tag.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
      
      if (!tag) {
        tag = await this.createTag({ name });
      }
      
      tags.push(tag);
    }
    
    return tags;
  }
}