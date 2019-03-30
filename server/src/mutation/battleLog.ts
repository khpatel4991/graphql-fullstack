import { getPlayerBattleLog, getPlayer } from '../crApi';
import { Player } from '../entity/Player';
import { Battle } from '../entity/Battle';
import { pubsub } from '..';
import { PLAYER_CREATED } from '../topics';
import { PlayerBattle } from '../entity/PlayerBattle';

export const battleLog = async (_: any, { playerTag }: any, __: any) => {
  try {
    let player = await Player.findOne({ where: { playerTag } });
    if (!player) {
      const playerData = await getPlayer(playerTag);
      if (!playerData) {
        throw new Error('Cant find user with tag');
      }
      player = Player.create(playerData);
      await player.save();
      pubsub.publish(PLAYER_CREATED, { playerUpsert: player });
    }
    const data = await getPlayerBattleLog(playerTag);
    if (!data) {
      throw new Error('Cant find player battles');
    }
    const b = data[0];
    await Battle.create(b).save();
    return data;
  } catch (e) {
    console.log('Error', e.message);
    return e;
  }
};
