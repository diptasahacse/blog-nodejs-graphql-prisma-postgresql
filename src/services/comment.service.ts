import { prisma } from '../config/database';
import { 
  getPaginationOptions, 
  createPaginatedResult 
} from '../utils/helpers';
import type { 
  CreateCommentInput, 
  CommentFilters,
  PaginationOptions 
} from '../types';

export class CommentService {
  async createComment(authorId: string, data: CreateCommentInput) {
    return prisma.comment.create({
      data: {
        ...data,
        authorId,
      },
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
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async getCommentById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
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
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                username: true,
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
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getComments(filters: CommentFilters, options: PaginationOptions) {
    const { skip, take, page, limit } = getPaginationOptions(options.page, options.limit);

    const where = {
      ...(filters.blogId && { blogId: filters.blogId }),
      ...(filters.authorId && { authorId: filters.authorId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.parentId !== undefined && { parentId: filters.parentId }),
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
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
          blog: {
            select: {
              id: true,
              title: true,
            },
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  username: true,
                },
              },
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return createPaginatedResult(comments, total, page, limit);
  }

  async updateComment(id: string, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
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
    });
  }

  async updateCommentStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return prisma.comment.update({
      where: { id },
      data: { status },
    });
  }

  async deleteComment(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  }

  async getCommentsByBlog(blogId: string, options: PaginationOptions) {
    const { skip, take, page, limit } = getPaginationOptions(options.page, options.limit);

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          blogId,
          status: 'APPROVED',
          parentId: null, // Only root comments
        },
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
          replies: {
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
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({
        where: {
          blogId,
          status: 'APPROVED',
          parentId: null,
        },
      }),
    ]);

    return createPaginatedResult(comments, total, page, limit);
  }
}