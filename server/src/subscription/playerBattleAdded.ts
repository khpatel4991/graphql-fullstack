import { pubsub } from '..';
import { PLAYER_BATTLE_ADDED } from '../topics';

export const playerBattleAdded = {
  subscribe: () => pubsub.asyncIterator(PLAYER_BATTLE_ADDED),
};
