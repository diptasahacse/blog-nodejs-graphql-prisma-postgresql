# Blog API Documentation

A comprehensive blog server implementation with both REST API and GraphQL endpoints.

## Features

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

## Project Structure

```
src/
├── config/           # Database and app configuration
├── controllers/      # REST API controllers
├── graphql/          # GraphQL schema and resolvers
│   ├── schemas/      # GraphQL type definitions
│   └── resolvers/    # GraphQL resolvers
├── middleware/       # Authentication and error handling
├── routes/           # REST API routes
├── services/         # Business logic services
├── types/            # TypeScript type definitions
├── utils/            # Helper functions and validation
└── server.ts         # Main server file

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## API Endpoints

### REST API (`/api`)

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

#### Users
- `GET /api/auth/users` - Get all users (paginated)
- `GET /api/auth/users/:id` - Get user by ID
- `GET /api/auth/users/username/:username` - Get user by username

#### Blogs
- `GET /api/blogs` - Get all blogs (with filtering and pagination)
- `POST /api/blogs` - Create new blog (authenticated)
- `GET /api/blogs/:id` - Get blog by ID
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `PUT /api/blogs/:id` - Update blog (authenticated, owner only)
- `DELETE /api/blogs/:id` - Delete blog (authenticated, owner only)
- `POST /api/blogs/:id/like` - Toggle like on blog (authenticated)
- `GET /api/blogs/my/blogs` - Get current user's blogs

#### Comments
- `GET /api/comments` - Get comments (with filtering)
- `POST /api/comments` - Create comment (authenticated)
- `GET /api/comments/blog/:blogId` - Get comments for specific blog
- `GET /api/comments/:id` - Get comment by ID
- `PUT /api/comments/:id` - Update comment (authenticated, owner only)
- `DELETE /api/comments/:id` - Delete comment (authenticated, owner only)
- `PATCH /api/comments/:id/status` - Update comment status (moderation)

#### Categories & Tags
- `GET /api/metadata/categories` - Get all categories
- `POST /api/metadata/categories` - Create category (authenticated)
- `GET /api/metadata/categories/:id` - Get category by ID
- `GET /api/metadata/categories/slug/:slug` - Get category by slug
- `PUT /api/metadata/categories/:id` - Update category (authenticated)
- `DELETE /api/metadata/categories/:id` - Delete category (authenticated)

- `GET /api/metadata/tags` - Get all tags
- `POST /api/metadata/tags` - Create tag (authenticated)
- `GET /api/metadata/tags/:id` - Get tag by ID
- `GET /api/metadata/tags/slug/:slug` - Get tag by slug
- `PUT /api/metadata/tags/:id` - Update tag (authenticated)
- `DELETE /api/metadata/tags/:id` - Delete tag (authenticated)

### GraphQL API (`/graphql`)

The GraphQL API provides the same functionality as the REST API but with more flexible queries and mutations. Key features:

- **Queries**: Fetch users, blogs, comments, categories, and tags
- **Mutations**: Create, update, delete operations
- **Nested Queries**: Get related data in single requests
- **Pagination**: Built-in pagination support
- **Authentication**: JWT-based authentication via Authorization header

## Database Schema

### Core Models

- **User**: User accounts with authentication
- **Profile**: Extended user profile information
- **Blog**: Blog posts with content, status, and metadata
- **Comment**: Comments with nested reply support
- **Category**: Blog categorization
- **Tag**: Blog tagging system
- **Like**: User likes on blog posts

### Key Features

- **Cascading Deletes**: Proper relationship handling
- **Unique Constraints**: Email, username, blog slugs
- **Enums**: Blog status (DRAFT/PUBLISHED/ARCHIVED), Comment status
- **Indexes**: Optimized for common queries

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Configure your DATABASE_URL and other settings

3. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Points**:
   - REST API: `http://localhost:8080/api`
   - GraphQL Playground: `http://localhost:8080/graphql`
   - Health Check: `http://localhost:8080/api/health`

## Authentication

All protected endpoints require an Authorization header with a Bearer token:

```
Authorization: Bearer <jwt-token>
```

Get a token by registering or logging in through the auth endpoints.

## Pagination

List endpoints support pagination with query parameters:

```
GET /api/blogs?page=1&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering & Search

Blog endpoints support advanced filtering:

```
GET /api/blogs?search=javascript&categoryId=123&published=true
```

## Development Notes

- **Modular Architecture**: Clean separation of concerns
- **Type Safety**: Full TypeScript implementation
- **Validation**: Zod schemas for input validation
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Password hashing, JWT tokens, input sanitization
- **Performance**: Efficient database queries with Prisma

## Production Considerations

- Configure CORS for your frontend domains
- Set up proper environment variables
- Configure database connection pooling
- Set up logging and monitoring
- Enable HTTPS
- Implement rate limiting
- Add API versioning if needed