import * as argon2 from 'argon2';

import { User } from '../entity/User';

export const register = async (_: any, { email, password }: any) => {
  const hashedPassword: string = await argon2.hash(password);
  await User.create({
    email,
    password: hashedPassword,
  }).save();
  return true;
};
