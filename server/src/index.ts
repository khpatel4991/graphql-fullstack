import 'dotenv/config';

import { ApolloServer, PubSub } from 'apollo-server';
import { v1 as neo4j } from 'neo4j-driver';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { logger } from './logger';

export const pubsub = new PubSub();

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers,
  config: {
    debug: false,
    query: {
      exclude: ['BattleLogPayload'],
    },
    mutation: {
      exclude: ['BattleLogPayload'],
    },
  },
});

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
);

const startServer = async () => {
  const apollo = new ApolloServer({
    context: { driver },
    schema,
    cors: {
      origin: '*',
    },
  });
  apollo.listen(process.env.GRAPHQL_LISTEN_PORT, '0.0.0.0').then(({ url }) => {
    logger.info(`GraphQL API ready at ${url}`);
  });
};

startServer().catch(e => {
  logger.error(e);
});
