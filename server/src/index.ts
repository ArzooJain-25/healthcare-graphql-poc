import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import * as db from './db';
import { createLoaders, Loaders } from './resolvers/loaders';

export interface Context {
  db: typeof db;
  user?: any;
  role?: string;
  loaders?: Loaders;
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Set up WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({
    schema: require('@graphql-tools/schema').makeExecutableSchema({ typeDefs, resolvers }),
    context: async () => {
      // Create fresh dataloaders for each websocket subscription
      return {
        db,
        loaders: createLoaders(db.pool),
      };
    },
  }, wsServer);

  // Set up Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    (req, res, next) => {
      if (!req.body) {
        req.body = {};
      }
      next();
    },
    expressMiddleware(server, {
      context: async () => {
        return {
          db,
          loaders: createLoaders(db.pool),
        };
      },
    }) as any,
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 WebSocket Server ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
