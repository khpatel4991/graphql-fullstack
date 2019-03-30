import 'dotenv/config';

import 'reflect-metadata';
import { createServer } from 'http';
import * as express from 'express';
import * as session from 'express-session';
import { PubSub } from 'graphql-subscriptions';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

export const pubsub = new PubSub();

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => ({ req }),
  });
  await createConnection();
  const app = express();
  app.use(
    session({
      secret: 'sdfsadfsfxcnmv,nzxcvm,.nzxcv',
      resave: false,
      saveUninitialized: false,
    })
  );
  apollo.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000',
    },
  });
  const subServer = createServer(app);
  apollo.installSubscriptionHandlers(subServer);
  subServer.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apollo.graphqlPath}`
    );
  });
};

startServer().catch(console.log);
