import { User } from '../entity/User';

export const users = async () => {
  const users = await User.find({ take: 20 });
  return users;
};
