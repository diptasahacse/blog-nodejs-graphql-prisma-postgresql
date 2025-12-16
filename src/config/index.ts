import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};

export default config;