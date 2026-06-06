import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import * as db from './db';

// Define the context interface
export interface Context {
  db: typeof db;
  user?: any; // Replace with actual User type when auth is implemented
  role?: string;
  loaders?: any; // Replace with actual Dataloaders type
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // Setup context with db pool
      return {
        db,
      };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
}

startServer().catch(console.error);
