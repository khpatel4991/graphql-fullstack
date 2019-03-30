import axios from 'axios';
import { Clan } from '../entity/Clan';

const CLASH_API_KEY = process.env.CLASH_API_KEY;

const clanUrl = (clanTag: string) => {
  const encodedClanTag = encodeURIComponent(clanTag);
  return `https://api.clashroyale.com/v1/clans/${encodedClanTag}`;
};

export const getClan = async (clanTag: string): Promise<Clan | null> => {
  try {
    const url = clanUrl(clanTag);
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
