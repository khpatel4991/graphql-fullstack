import { IResolvers } from 'graphql-tools';

import * as Mutation from './mutation';
import * as Query from './query';

export const resolvers: IResolvers = {
  Query,
  Mutation,
};
