import { pubsub } from '..';
import { BATTLE_ADDED } from '../topics';

export const battleAdded = {
  subscribe: () => pubsub.asyncIterator(BATTLE_ADDED),
};
