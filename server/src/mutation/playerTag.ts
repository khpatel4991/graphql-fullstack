import { getPlayer } from '../crApi';
import { findPlayer, upsertPlayer } from '../g';

export const playerTag = async (_: any, { tag }: any, __: any) => {
  try {
    const player = await getPlayer(tag);
    if (!player) {
      throw new Error('Cant find player with tag');
    }
    const existingPlayer = await findPlayer(tag);

    await upsertPlayer(player, existingPlayer);
    return player;
  } catch (e) {
    return e;
  }
};
