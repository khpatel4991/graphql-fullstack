import * as argon2 from 'argon2';

import { User } from '../entity/User';

export const login = async (_: any, { email, password }: any, { req }: any) => {
  try {
    console.time(`Logging in ${email}: `);
    const user = await User.findOne({ where: { email } });
    console.timeEnd(`Logging in ${email}: `);
    if (!user) {
      throw new Error(`No user with email ${email}`);
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      throw new Error(`Password mismatch for ${email}`);
    }
    req.session.userId = user.id;
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
