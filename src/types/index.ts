export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BlogFilters {
  search?: string;
  categoryId?: string;
  tagIds?: string[];
  authorId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published?: boolean;
}

export interface CommentFilters {
  blogId?: string;
  authorId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  parentId?: string | null;
}

export interface AuthPayload {
  id: string;
  email: string;
  username: string;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
}

export interface CreateProfileInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
}

export interface CreateBlogInput {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId?: string;
  tagIds?: string[];
  published?: boolean;
}

export interface UpdateBlogInput {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId?: string;
  tagIds?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published?: boolean;
}

export interface CreateCommentInput {
  content: string;
  blogId: string;
  parentId?: string;
}