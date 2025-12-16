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

export interface LoginInput {
  email: string;
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

export interface UpdateProfileInput {
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

export interface UpdateCommentInput {
  content: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}

// GraphQL specific interfaces
export interface UserArgs {
  id: string;
}

export interface UserByUsernameArgs {
  username: string;
}

export interface UsersArgs {
  pagination?: PaginationOptions;
}

export interface BlogArgs {
  id: string;
}

export interface BlogBySlugArgs {
  slug: string;
}

export interface BlogsArgs {
  filters?: BlogFilters;
  pagination?: PaginationOptions;
}

export interface MyBlogsArgs {
  pagination?: PaginationOptions;
}

export interface CommentArgs {
  id: string;
}

export interface CommentsArgs {
  blogId?: string;
  authorId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  pagination?: PaginationOptions;
}

export interface CommentsByBlogArgs {
  blogId: string;
  pagination?: PaginationOptions;
}

// Mutation args interfaces
export interface RegisterArgs {
  input: CreateUserInput;
}

export interface LoginArgs {
  input: LoginInput;
}

export interface UpdateProfileArgs {
  input: UpdateProfileInput;
}

export interface CreateBlogArgs {
  input: CreateBlogInput;
}

export interface UpdateBlogArgs {
  id: string;
  input: UpdateBlogInput;
}

export interface DeleteBlogArgs {
  id: string;
}

export interface ToggleLikeArgs {
  blogId: string;
}

export interface CreateCommentArgs {
  input: CreateCommentInput;
}

export interface UpdateCommentArgs {
  id: string;
  content: string;
}

export interface UpdateCommentStatusArgs {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DeleteCommentArgs {
  id: string;
}

export interface CreateCategoryArgs {
  input: CreateCategoryInput;
}

export interface UpdateCategoryArgs {
  input: UpdateCategoryInput;
}

export interface DeleteCategoryArgs {
  id: string;
}

export interface CreateTagArgs {
  input: CreateTagInput;
}

export interface UpdateTagArgs {
  input: UpdateTagInput;
}

export interface DeleteTagArgs {
  id: string;
}

// Parent types for field resolvers
export interface UserParent {
  id: string;
  email: string;
  username: string;
  _count?: {
    blogs?: number;
    comments?: number;
    likes?: number;
  };
}

export interface BlogParent {
  id: string;
  authorId: string;
  tags?: Array<{ tag: unknown }>;
  likes?: Array<{ userId: string }>;
  _count?: {
    comments?: number;
    likes?: number;
  };
}

export interface CommentParent {
  id: string;
  authorId: string;
  replies?: unknown[];
  _count?: {
    replies?: number;
  };
}