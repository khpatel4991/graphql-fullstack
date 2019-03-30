import { User } from '../entity/User';

export const users = async () => {
  const userList = await User.find({ take: 20 });
  return userList;
};
