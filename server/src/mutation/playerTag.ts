import { getPlayer } from '../crApi';
import { User } from '../entity/User';

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
    user.playerTag = data.tag;
    await user.save();
    return user;
  } catch (e) {
    return null;
  }
};
