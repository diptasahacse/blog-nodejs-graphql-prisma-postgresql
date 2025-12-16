import dotenv from 'dotenv';
import { createApp } from './app';
import { config } from './config';
import { prisma } from './config/database';

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create Express app
    const app = await createApp();

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
