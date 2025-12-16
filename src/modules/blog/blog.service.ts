import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { 
  generateSlug,
  getPaginationOptions, 
  createPaginatedResult 
} from '../../utils/helpers';
import type { 
  CreateBlogInput, 
  UpdateBlogInput, 
  BlogFilters,
  PaginationOptions, 
  PaginatedResult 
} from '../../types';

export class BlogService {
  async createBlog(authorId: string, data: CreateBlogInput) {
    const slug = generateSlug(data.title);
    
    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (await this.getBlogBySlug(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const { tagIds, ...blogData } = data;

    const blog = await prisma.blog.create({
      data: {
        ...blogData,
        slug: finalSlug,
        authorId,
        publishedAt: data.published ? new Date() : null,
        status: data.published ? 'PUBLISHED' : 'DRAFT',
        ...(tagIds && {
          tags: {
            create: tagIds.map(tagId => ({
              tagId,
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return blog;
  }

  async updateBlog(id: string, data: UpdateBlogInput) {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      throw new Error('Blog not found');
    }

    let slug = existingBlog.slug;
    if (data.title && data.title !== existingBlog.title) {
      const newSlug = generateSlug(data.title);
      let finalSlug = newSlug;
      let counter = 1;
      while (await this.getBlogBySlug(finalSlug) && finalSlug !== existingBlog.slug) {
        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }
      slug = finalSlug;
    }

    const { tagIds, ...blogData } = data;

    // Handle publishing
    let publishedAt = existingBlog.publishedAt;
    if (data.published && !existingBlog.published) {
      publishedAt = new Date();
    } else if (data.published === false) {
      publishedAt = null;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...blogData,
        slug,
        publishedAt,
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map(tagId => ({
              tagId,
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return blog;
  }

  async getBlogById(id: string) {
    return prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: { status: 'APPROVED' },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    profile: {
                      select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async getBlogBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async getBlogs(filters: BlogFilters, options: PaginationOptions) {
    const { skip, take, page, limit } = getPaginationOptions(options.page, options.limit);

    const where: Prisma.BlogWhereInput = {
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { content: { contains: filters.search, mode: 'insensitive' } },
          { excerpt: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.authorId && { authorId: filters.authorId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.published !== undefined && { published: filters.published }),
      ...(filters.tagIds && {
        tags: {
          some: {
            tagId: { in: filters.tagIds },
          },
        },
      }),
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({ where }),
    ]);

    return createPaginatedResult(blogs, total, page, limit);
  }

  async deleteBlog(id: string) {
    return prisma.blog.delete({
      where: { id },
    });
  }

  async toggleLike(userId: string, blogId: string) {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          blogId,
        },
      });
      return { liked: true };
    }
  }
}