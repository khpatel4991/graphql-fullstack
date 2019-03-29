import { Player } from '../entity/Player';

export const users = async () => {
  const players = await Player.find({ take: 20 });
  return players;
};
