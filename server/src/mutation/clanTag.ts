import { getClan } from '../crApi';
import { Clan } from '../entity/Clan';
import { pubsub } from '..';
import { CLAN_CREATED, CLAN_UPDATED } from '../topics';

export const clanTag = async (_: any, { tag }: any, __: any) => {
  try {
    console.log('Looking for clan Tag', tag);
    const data = await getClan(tag);
    if (!data) {
      throw new Error('Cant find user with tag');
    }
    let clan = await Clan.findOne({ where: { tag } });
    if (!clan) {
      clan = Clan.create(data);
      await clan.save();
      pubsub.publish(CLAN_CREATED, { clanUpsert: clan });
    } else {
      await Clan.update(clan.id, data);
      await clan.reload();
      pubsub.publish(CLAN_UPDATED, { clanUpsert: clan });
    }
    return clan;
  } catch (e) {
    return e;
  }
};
