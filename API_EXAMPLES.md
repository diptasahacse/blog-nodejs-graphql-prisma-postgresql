# API Testing Examples

Here are some examples of how to test the blog API endpoints using curl or any HTTP client.

## Authentication

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

Save the token from the response for authenticated requests.

## Blog Operations

### 3. Create a blog (authenticated)
```bash
curl -X POST http://localhost:8080/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "excerpt": "A brief excerpt",
    "published": true
  }'
```

### 4. Get all blogs (public)
```bash
curl http://localhost:8080/api/blogs
```

### 5. Get blogs with pagination and filtering
```bash
curl "http://localhost:8080/api/blogs?page=1&limit=5&search=javascript&published=true"
```

### 6. Get a specific blog by slug
```bash
curl http://localhost:8080/api/blogs/slug/my-first-blog-post
```

### 7. Update a blog (authenticated)
```bash
curl -X PUT http://localhost:8080/api/blogs/BLOG_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Blog Title",
    "content": "Updated content..."
  }'
```

### 8. Like a blog (authenticated)
```bash
curl -X POST http://localhost:8080/api/blogs/BLOG_ID_HERE/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Comments

### 9. Create a comment (authenticated)
```bash
curl -X POST http://localhost:8080/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great blog post!",
    "blogId": "BLOG_ID_HERE"
  }'
```

### 10. Get comments for a blog
```bash
curl http://localhost:8080/api/comments/blog/BLOG_ID_HERE
```

## Categories and Tags

### 11. Create a category (authenticated)
```bash
curl -X POST http://localhost:8080/api/metadata/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Technology",
    "description": "Posts about technology and programming"
  }'
```

### 12. Get all categories
```bash
curl http://localhost:8080/api/metadata/categories
```

### 13. Create a tag (authenticated)
```bash
curl -X POST http://localhost:8080/api/metadata/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "JavaScript"
  }'
```

### 14. Get all tags
```bash
curl http://localhost:8080/api/metadata/tags
```

## GraphQL Examples

### 15. GraphQL Query - Get all blogs
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { blogs { data { id title slug excerpt author { username } category { name } tags { name } } } }"
  }'
```

### 16. GraphQL Mutation - Create a blog (authenticated)
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "query": "mutation CreateBlog($input: CreateBlogInput!) { createBlog(input: $input) { id title slug content author { username } } }",
    "variables": {
      "input": {
        "title": "GraphQL Blog Post",
        "content": "This blog was created using GraphQL!",
        "published": true
      }
    }
  }'
```

### 17. GraphQL Query - Get user profile (authenticated)
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "query": "query { me { id username email profile { firstName lastName bio } blogCount commentCount } }"
  }'
```

## Health Check
```bash
curl http://localhost:8080/api/health
```

## Notes

- Replace `YOUR_TOKEN_HERE` with the actual JWT token from login/register response
- Replace `BLOG_ID_HERE` with actual blog IDs
- The server runs on port 8080 by default
- All responses are in JSON format
- Error responses include appropriate HTTP status codes and error messages