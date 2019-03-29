import axios from 'axios';
import { Player } from '../entity/Player';
const CLASH_API_KEY = process.env.CLASH_API_KEY;

const playerUrl = (playerTag: string): string => {
  const encodedPlayerTag = encodeURIComponent(playerTag);
  return `https://api.clashroyale.com/v1/players/${encodedPlayerTag}`;
};

export const getPlayer = async (playerTag: string): Promise<Player | null> => {
  try {
    const url = playerUrl(playerTag);
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
