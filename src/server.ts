import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createGraphQLServer } from './graphql';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error';
import { config } from './config';
import { prisma } from './config/database';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourfrontend.com'] // Add your production URLs here
    : true, // Allow all origins in development
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API Server is running! 🚀',
    version: '1.0.0',
    environment: config.nodeEnv,
    endpoints: {
      rest: '/api',
      graphql: '/graphql',
      health: '/api/health',
    },
    timestamp: new Date().toISOString(),
  });
});

// REST API routes
app.use('/api', routes);

// GraphQL setup
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create and setup GraphQL server
    const { middleware: graphqlMiddleware } = await createGraphQLServer();
    app.use('/graphql', graphqlMiddleware);

    // Error handling middleware (must be last)
    app.use(notFound);
    app.use(errorHandler);

    const port = config.port;
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📱 REST API: http://localhost:${port}/api`);
      console.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);
      console.log(`📊 Health Check: http://localhost:${port}/api/health`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
