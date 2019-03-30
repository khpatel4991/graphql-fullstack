import { Player } from '../entity/Player';

export const players = async () => {
  const playerList = await Player.find({ take: 20 });
  return playerList;
};
