import { getPlayerBattleLog, getPlayer } from '../crApi';
import { Player } from '../entity/Player';
import { Battle } from '../entity/Battle';
import { pubsub } from '..';
import { PLAYER_CREATED, BATTLE_ADDED } from '../topics';
// import { PlayerBattle } from '../entity/PlayerBattle';

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
    const saveAllBattles = data.map(battle => {
      const { battleTime } = battle;
      return new Promise(async resolve => {
        let existing = await Battle.findOne({ where: { battleTime } });
        if (!existing) {
          existing = Battle.create(battle);
          await existing.save();
          pubsub.publish(BATTLE_ADDED, { battleAdded: existing });
        }
        resolve();
      });
    });
    await Promise.all(saveAllBattles);
    return data;
  } catch (e) {
    console.log('Error', e.message);
    return e;
  }
};
