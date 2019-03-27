import { User } from '../entity/User';

export const me = async (_: any, __: any, { req }: any): Promise<User> => {
  try {
    if (!req.session.userId) {
      throw new Error('No user in session');
    }
    const user = await User.findOne(req.session.userId);
    if (!user) {
      throw new Error('No user in session');
    }
    return user;
  } catch (e) {
    // console.log(e.message);
  }
};
