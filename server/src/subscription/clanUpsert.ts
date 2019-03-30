import { pubsub } from '..';
import { CLAN_CREATED, CLAN_UPDATED } from '../topics';

export const clanUpsert = {
  subscribe: () => pubsub.asyncIterator([CLAN_CREATED, CLAN_UPDATED]),
};
