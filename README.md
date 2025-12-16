# Blog API Documentation

A comprehensive blog server implementation with both REST API and GraphQL endpoints, featuring modular architecture, complete TypeScript implementation, and robust authentication.

## 🌟 Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with user registration and login
- 📝 **Blog Management**: Create, read, update, delete blog posts with rich content
- 💬 **Comment System**: Nested comments with moderation capabilities
- 🏷️ **Categories & Tags**: Organize content with categories and tags
- 👤 **User Profiles**: User management with customizable profiles
- ❤️ **Like System**: Users can like/unlike blog posts
- 📄 **Pagination**: Efficient pagination for all list endpoints
- 🔍 **Search & Filtering**: Advanced filtering and search capabilities
- 🎮 **Dual APIs**: Both REST API and GraphQL endpoints
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🏗️ **Modular Architecture**: Feature-based module organization
- 🎯 **Type Safety**: Complete TypeScript implementation without `any` types

## 📁 Project Structure

```
src/
├── config/           # Database configuration
├── middleware/       # Authentication & error handling
├── modules/          # Feature-based modules
│   ├── user/         # User management module
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   ├── user.routes.ts
│   │   ├── user.resolvers.ts
│   │   └── index.ts
│   ├── blog/         # Blog management module
│   ├── comment/      # Comment system module
│   └── category/     # Category & tag management module
├── types/            # TypeScript interface definitions
├── utils/            # Helper functions and validation
├── graphql/          # GraphQL schema and resolvers
├── routes/           # Main route configuration
└── server.ts         # Application entry point

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## 🚀 API Endpoints

### REST API (`/api`)

#### 🔐 Authentication

##### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
}
```

##### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Get/Update Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer and blogger",
  "website": "https://johndoe.dev",
  "location": "New York, USA"
}
```

#### 📝 Blogs

##### Get All Blogs (with filtering)
```http
GET /api/blogs?search=javascript&categoryId=uuid&published=true&page=1&limit=10
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "title": "Getting Started with JavaScript",
      "slug": "getting-started-with-javascript",
      "content": "Full blog content here...",
      "excerpt": "Brief description of the post",
      "featuredImage": "https://example.com/image.jpg",
      "published": true,
      "status": "PUBLISHED",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "author": {
        "id": "uuid-string",
        "username": "johndoe",
        "email": "user@example.com"
      },
      "category": {
        "id": "uuid-string",
        "name": "Programming",
        "slug": "programming"
      },
      "tags": [
        {
          "id": "uuid-string",
          "name": "JavaScript",
          "slug": "javascript"
        }
      ],
      "_count": {
        "comments": 5,
        "likes": 12
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

##### Create Blog
```http
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the full content of my blog post...",
  "excerpt": "A brief description of the post",
  "featuredImage": "https://example.com/featured-image.jpg",
  "categoryId": "uuid-string",
  "tagIds": ["tag-uuid-1", "tag-uuid-2"],
  "published": true
}
```

##### Update Blog
```http
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Blog Title",
  "content": "Updated content...",
  "status": "PUBLISHED"
}
```

##### Delete Blog
```http
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

##### Toggle Like
```http
POST /api/blogs/:id/like
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Blog liked successfully",
  "isLiked": true,
  "likeCount": 13
}
```

#### 💬 Comments

##### Get Comments for Blog
```http
GET /api/comments/blog/:blogId?page=1&limit=10
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "content": "Great article! Thanks for sharing.",
      "status": "APPROVED",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "author": {
        "id": "uuid-string",
        "username": "commenter",
        "email": "commenter@example.com"
      },
      "replies": [
        {
          "id": "uuid-string",
          "content": "Thanks for reading!",
          "status": "APPROVED",
          "createdAt": "2024-01-15T11:30:00.000Z",
          "author": {
            "id": "uuid-string",
            "username": "johndoe"
          }
        }
      ],
      "_count": {
        "replies": 1
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

##### Create Comment
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a comment on the blog post",
  "blogId": "blog-uuid",
  "parentId": "parent-comment-uuid" // Optional for replies
}
```

##### Update Comment Status (Moderation)
```http
PATCH /api/comments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED" // PENDING, APPROVED, REJECTED
}
```

#### 🏷️ Categories & Tags

##### Get All Categories
```http
GET /api/categories
```

**Success Response (200):**
```json
[
  {
    "id": "uuid-string",
    "name": "Programming",
    "slug": "programming",
    "description": "Programming tutorials and articles",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "blogs": 15
    }
  }
]
```

##### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Development",
  "description": "Articles about web development"
}
```

### 🎮 GraphQL API (`/graphql`)

The GraphQL API provides the same functionality as the REST API but with more flexible queries and mutations.

#### Example Queries

##### Get User with Blogs
```graphql
query GetUserWithBlogs($username: String!) {
  userByUsername(username: $username) {
    id
    email
    username
    profile {
      firstName
      lastName
      bio
      avatar
    }
    blogCount
    commentCount
  }
  
  blogs(filters: { authorId: $userId }, pagination: { page: 1, limit: 5 }) {
    data {
      id
      title
      slug
      excerpt
      createdAt
      commentCount
      likeCount
      category {
        name
        slug
      }
      tags {
        name
        slug
      }
    }
    pagination {
      total
      pages
      hasNext
    }
  }
}
```

##### Search Blogs with Filters
```graphql
query SearchBlogs($search: String, $categoryId: ID, $page: Int) {
  blogs(
    filters: { 
      search: $search, 
      categoryId: $categoryId, 
      published: true 
    },
    pagination: { page: $page, limit: 10 }
  ) {
    data {
      id
      title
      slug
      excerpt
      featuredImage
      createdAt
      author {
        username
        profile {
          firstName
          lastName
        }
      }
      category {
        name
        slug
      }
      tags {
        name
        slug
      }
      commentCount
      likeCount
      isLikedByUser
    }
    pagination {
      page
      limit
      total
      pages
      hasNext
      hasPrev
    }
  }
}
```

##### Get Blog with Comments
```graphql
query GetBlogWithComments($slug: String!) {
  blogBySlug(slug: $slug) {
    id
    title
    content
    author {
      username
      profile {
        firstName
        lastName
        avatar
      }
    }
    category {
      name
      slug
    }
    tags {
      name
      slug
    }
    commentCount
    likeCount
    isLikedByUser
  }
  
  commentsByBlog(blogId: $blogId, pagination: { page: 1, limit: 20 }) {
    data {
      id
      content
      createdAt
      author {
        username
        profile {
          firstName
          lastName
          avatar
        }
      }
      replies {
        id
        content
        createdAt
        author {
          username
          profile {
            firstName
            lastName
          }
        }
      }
      replyCount
    }
    pagination {
      total
      hasNext
    }
  }
}
```

#### Example Mutations

##### User Registration
```graphql
mutation RegisterUser($input: CreateUserInput!) {
  register(input: $input) {
    user {
      id
      email
      username
    }
    token
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securePassword123"
  }
}
```

##### Create Blog Post
```graphql
mutation CreateBlog($input: CreateBlogInput!) {
  createBlog(input: $input) {
    id
    title
    slug
    content
    published
    createdAt
    author {
      username
    }
    category {
      name
      slug
    }
    tags {
      name
      slug
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "My First GraphQL Blog Post",
    "content": "This is the full content of my blog post...",
    "excerpt": "Brief description",
    "categoryId": "uuid-string",
    "tagIds": ["tag-uuid-1", "tag-uuid-2"],
    "published": true
  }
}
```

##### Add Comment
```graphql
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    content
    createdAt
    author {
      username
      profile {
        firstName
        lastName
      }
    }
    replyCount
  }
}
```

**Variables:**
```json
{
  "input": {
    "content": "Great article! Thanks for sharing.",
    "blogId": "blog-uuid",
    "parentId": null
  }
}
```

##### Authentication Headers
All authenticated GraphQL operations require an Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ❌ Error Handling

### Common Error Responses

#### Authentication Errors
```json
{
  "error": "Access token required",
  "message": "Authorization header is missing"
}
```

```json
{
  "error": "Invalid token",
  "message": "Authentication token is invalid"
}
```

```json
{
  "error": "Token expired",
  "message": "Authentication token has expired"
}
```

#### Validation Errors
```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    },
    {
      "path": ["password"],
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

#### Database Errors
```json
{
  "error": "Duplicate entry",
  "message": "A record with this information already exists"
}
```

```json
{
  "error": "Record not found",
  "message": "The requested resource was not found"
}
```

#### Authorization Errors
```json
{
  "error": "Forbidden",
  "message": "Not authorized to perform this action"
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **500**: Internal Server Error

## 🗄️ Database Schema

### Core Models

#### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  profile   Profile?
  blogs     Blog[]
  comments  Comment[]
  likes     Like[]
}
```

#### Blog Model
```prisma
model Blog {
  id             String      @id @default(cuid())
  title          String
  slug           String      @unique
  content        String
  excerpt        String?
  featuredImage  String?
  published      Boolean     @default(false)
  status         BlogStatus  @default(DRAFT)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  
  // Foreign Keys
  authorId       String
  categoryId     String?
  
  // Relations
  author         User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category       Category?   @relation(fields: [categoryId], references: [id])
  tags           BlogTag[]
  comments       Comment[]
  likes          Like[]
}
```

#### Comment Model (with nesting support)
```prisma
model Comment {
  id        String        @id @default(cuid())
  content   String
  status    CommentStatus @default(PENDING)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  
  // Foreign Keys
  authorId  String
  blogId    String
  parentId  String?
  
  // Relations
  author    User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  blog      Blog          @relation(fields: [blogId], references: [id], onDelete: Cascade)
  parent    Comment?      @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[]     @relation("CommentReplies")
}
```

### Enums
```prisma
enum BlogStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Key Features
- **Cascading Deletes**: User deletion removes all related data
- **Unique Constraints**: Prevents duplicate emails, usernames, blog slugs
- **Optimized Indexes**: Fast lookups for common queries
- **Relationship Integrity**: Foreign key constraints ensure data consistency

## 🔧 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd blog-nodejs-graphql-prisma-postgresql
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="24h"
   
   # Server
   PORT=8080
   NODE_ENV="development"
   
   # CORS (optional)
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Database Setup**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Verify Installation**:
   - REST API: `http://localhost:8080/api/health`
   - GraphQL Playground: `http://localhost:8080/graphql`

## 🔐 Authentication Flow

### Registration Flow
1. User submits registration data
2. Server validates input using Zod schemas
3. Password is hashed using bcryptjs
4. User record is created in database
5. JWT token is generated and returned

### Login Flow
1. User submits email and password
2. Server finds user by email
3. Password is verified against hash
4. JWT token is generated with user payload
5. Token is returned for subsequent requests

### Protected Routes
All protected endpoints require:
```http
Authorization: Bearer <jwt-token>
```

Token payload includes:
```json
{
  "id": "user-uuid",
  "email": "user@example.com", 
  "username": "johndoe",
  "iat": 1642680000,
  "exp": 1642766400
}
```

## 📄 Pagination & Filtering

### Pagination Parameters
All list endpoints support pagination:
```http
GET /api/blogs?page=1&limit=10
GET /api/comments?page=2&limit=5
```

### Pagination Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Blog Filtering Options
```http
GET /api/blogs?search=javascript&categoryId=uuid&tagIds=uuid1,uuid2&authorId=uuid&published=true&status=PUBLISHED
```

**Filter Parameters:**
- `search`: Text search in title and content
- `categoryId`: Filter by specific category
- `tagIds`: Filter by tag IDs (comma-separated)
- `authorId`: Filter by author
- `published`: Boolean filter for published status
- `status`: Filter by blog status (DRAFT/PUBLISHED/ARCHIVED)

### Comment Filtering Options
```http
GET /api/comments?blogId=uuid&authorId=uuid&status=APPROVED&parentId=uuid
```

**Filter Parameters:**
- `blogId`: Comments for specific blog
- `authorId`: Comments by specific author
- `status`: Filter by comment status
- `parentId`: Filter by parent comment (for replies)

### GraphQL Pagination
```graphql
query GetBlogs($filters: BlogFiltersInput, $pagination: PaginationInput) {
  blogs(filters: $filters, pagination: $pagination) {
    data {
      id
      title
      # ... other fields
    }
    pagination {
      page
      limit
      total
      pages
      hasNext
      hasPrev
    }
  }
}
```

## 🛡️ Security Features

### Password Security
- Passwords hashed using bcryptjs with salt rounds
- Minimum password requirements enforced
- No password storage in plain text

### JWT Security
- Tokens signed with secret key
- Configurable expiration times
- Stateless authentication

### Input Validation
- All inputs validated using Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection through input sanitization

### CORS Configuration
```typescript
// Configurable CORS settings
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
```

## ⚡ Performance Features

### Database Optimization
- Efficient Prisma queries with selective field inclusion
- Proper indexing on frequently queried fields
- Connection pooling for production environments

### Pagination Strategy
- Cursor-based pagination for large datasets
- Efficient count queries for pagination metadata
- Optimized database queries to prevent N+1 problems

### Caching Considerations
- Stateless JWT tokens reduce database lookups
- Efficient query patterns for related data
- Ready for Redis caching implementation

## 🧪 Testing

### Manual Testing
Use the provided API examples with tools like:
- **Postman**: Import the API collection
- **cURL**: Command-line testing
- **GraphQL Playground**: Built-in GraphQL explorer

### Example cURL Commands
```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create blog (with token)
curl -X POST http://localhost:8080/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Blog","content":"Blog content here","published":true}'
```

## 🚀 Deployment

### Environment Variables
```env
# Production settings
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com
```

### Production Considerations
- **Environment Variables**: Use secure environment variable management
- **Database**: Configure connection pooling and SSL
- **HTTPS**: Enable HTTPS with proper certificates
- **Rate Limiting**: Implement rate limiting middleware
- **Logging**: Set up structured logging (Winston, Pino)
- **Monitoring**: Add health checks and monitoring
- **Error Tracking**: Integrate error tracking service

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 8080
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test thoroughly
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Modular Architecture**: Feature-based organization
- **Error Handling**: Comprehensive error handling
- **Documentation**: Clear code documentation

## 📚 Additional Resources

- [Prisma Documentation](https://prisma.io/docs)
- [GraphQL Documentation](https://graphql.org/learn)
- [Express.js Documentation](https://expressjs.com)
- [JWT.io](https://jwt.io) - JWT token debugger
- [PostgreSQL Documentation](https://postgresql.org/docs)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.