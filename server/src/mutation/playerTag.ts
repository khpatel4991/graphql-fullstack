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
    const data = await getPlayer(tag);
    if (!data) {
      throw new Error('Cant find user with tag');
    }
    let player = await Player.findOne({ where: { tag } });
    if (!player) {
      player = Player.create(data);
      await player.save();
    } else {
      await Player.update(player.id, data);
      await player.reload();
    }
    return player;
  } catch (e) {
    console.log(e.message);
    return e;
  }
};
