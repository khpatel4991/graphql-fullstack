import { getPlayer } from '../crApi';
import { User } from '../entity/User';
import { Player } from '../entity/Player';

export const playerTag = async (_: any, { tag }: any, { req }: any) => {
  try {
    console.log(`Looking for ${tag}`);
    if (!req.session.userId) {
      throw new Error('No user. Please login');
    }
    console.log(`Userid exists ${req.session.userId}`);
    const user = await User.findOne(req.session.userId);
    if (!user) {
      throw new Error('Cant find user');
    }
    console.log(`User exists`);
    const data = await getPlayer(tag);
    if (!data) {
      throw new Error('Cant find user with tag');
    }
    const player = await Player.create(data).save();
    console.log(
      `Data: ${JSON.stringify(data.tag)} exists ${tag} with player: ${
        player.name
      }`
    );
    user.player = player;
    await user.save();
    return user;
  } catch (e) {
    return e;
  }
};
