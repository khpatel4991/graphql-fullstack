import { getPlayer } from '../crApi';

export const playerTag = async (_: any, payload: any, context: any) => {
  if (!context.req.session.userId) {
    throw new Error('No user. Please login');
  }
  const data = await getPlayer(payload.playerTag);
  if (data === null) {
    throw new Error('Cant find user with tag');
  }
  return data;
};
