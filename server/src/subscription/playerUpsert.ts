import { pubsub } from '..';
import { PLAYER_CREATED, PLAYER_UPDATED } from '../topics';

export const playerUpsert = {
  subscribe: () => pubsub.asyncIterator([PLAYER_CREATED, PLAYER_UPDATED]),
};
