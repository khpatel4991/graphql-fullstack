import { getPlayer } from '../crApi';
import { Player } from '../entity/Player';
import { pubsub } from '..';
import { PLAYER_CREATED, PLAYER_UPDATED } from '../topics';

export const playerTag = async (_: any, { tag }: any, __: any) => {
  try {
    const data = await getPlayer(tag);
    if (!data) {
      throw new Error('Cant find user with tag');
    }
    let player = await Player.findOne({ where: { tag } });
    if (!player) {
      player = Player.create(data);
      await player.save();
      pubsub.publish(PLAYER_CREATED, { playerUpsert: player });
    } else {
      await Player.update(player.id, data);
      await player.reload();
      pubsub.publish(PLAYER_UPDATED, { playerUpsert: player });
    }
    return player;
  } catch (e) {
    return e;
  }
};
