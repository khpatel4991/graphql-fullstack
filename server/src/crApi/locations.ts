import axios from 'axios';
import { Location } from '../entity/Clan';

const CLASH_API_KEY = process.env.CLASH_API_KEY;

export const getLocations = async (): Promise<Array<Location>> => {
  try {
    const url = 'https://api.clashroyale.com/v1/locations';
    const res = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${CLASH_API_KEY}`,
      },
    });
    return res.data.items;
  } catch (e) {
    console.log(`No cards found. Error: ${e}`);
    return [];
  }
};
