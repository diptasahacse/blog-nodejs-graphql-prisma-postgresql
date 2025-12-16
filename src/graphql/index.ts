import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './schemas/typeDefs';
import { resolvers, GraphQLContext } from './resolvers';
import { verifyToken } from '../utils/helpers';
import type { AuthPayload } from '../types';

export async function createGraphQLServer() {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      // Log the error for debugging
      console.error('GraphQL Error:', error);
      
      // Return a formatted error
      return {
        message: formattedError.message,
        // Only include error details in development
        ...(process.env.NODE_ENV === 'development' && {
          locations: formattedError.locations,
          path: formattedError.path,
          extensions: formattedError.extensions,
        }),
      };
    },
  });

  await server.start();

  const middleware = expressMiddleware(server, {
    context: async ({ req }) => {
      let user: AuthPayload | undefined;

      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        try {
          user = verifyToken(token);
        } catch (error) {
          // Invalid token, but don't throw error here
          // Let resolvers handle authentication as needed
          user = undefined;
        }
      }

      return { user };
    },
  });

  return { server, middleware };
}