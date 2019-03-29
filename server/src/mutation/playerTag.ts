import { getPlayer } from '../crApi';
import { User } from '../entity/User';
import { Player } from '../entity/Player';

export const playerTag = async (_: any, { tag }: any, { req }: any) => {
  try {
    if (!req.session.userId) {
      throw new Error('No user. Please login');
    }
    const user = await User.findOne(req.session.userId);
    if (!user) {
      throw new Error('Cant find user');
    }
    // console.time(`Player ${tag} fetched`);
    const data = await getPlayer(tag);
    // console.timeEnd(`Player ${tag} fetched`);
    if (!data) {
      throw new Error('Cant find user with tag');
    }
    // console.time(`Persist ${tag}`);
    let player = await Player.findOne({ where: { tag } });
    if (!player) {
      player = Player.create(data);
      await player.save();
    } else {
      await Player.update(player.id, data);
      await player.reload();
    }
    // console.timeEnd(`Persist ${tag}`);
    return player;
  } catch (e) {
    return e;
  }
};
