import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createGraphQLServer } from './graphql';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error';
import { config } from './config';

// Load environment variables
dotenv.config();

export async function createApp(): Promise<express.Application> {
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

  // Create and setup GraphQL server
  const { middleware: graphqlMiddleware } = await createGraphQLServer();
  app.use('/graphql', graphqlMiddleware);

  // Error handling middleware (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}