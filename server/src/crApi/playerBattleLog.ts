import axios from 'axios';
import { Battle } from '../entity/Battle';
const CLASH_API_KEY = process.env.CLASH_API_KEY;

const playerBattleLogUrl = (playerTag: string): string => {
  const encodedPlayerTag = encodeURIComponent(playerTag);
  return `https://api.clashroyale.com/v1/players/${encodedPlayerTag}/battlelog`;
};

export const getPlayerBattleLog = async (
  playerTag: string
): Promise<Battle[] | null> => {
  try {
    const url = playerBattleLogUrl(playerTag);
    const res = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${CLASH_API_KEY}`,
      },
    });
    return res.data;
  } catch (e) {
    return null;
  }
};
