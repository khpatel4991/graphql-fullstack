import { gql } from 'apollo-server';
import { client } from '../client';
import { getClan } from '../crApi';
import { Clan } from '../entity/Clan';
import {
  generatePlayerTagMutation,
  execMutation,
  generateClanMemberListMutations,
} from '../g';
import { logger } from '../logger';

const findClan = async (tag: string): Promise<Clan> => {
  const query = /* GraphQL */ `
    clan: Clan(tag: "${tag}") {
      tag
    }
  `;
  const result = await client.query({
    query: gql(`query{${query}}`),
  });
  return result.data.clan[0];
};

const clanMutation = (crResponse: Clan, create = true) => {
  const Entity = 'Clan';
  const pre = create ? `Create${Entity}` : `Update${Entity}`;
  return /* GraphQL */ `mutation {
  clan: ${pre}(tag:"${crResponse.tag}", badgeId:${
    crResponse.badgeId
  }, clanChestLevel:${crResponse.clanChestLevel}, clanChestMaxLevel:${
    crResponse.clanChestMaxLevel
  }, clanChestPoints:${crResponse.clanChestPoints || 0}, clanChestStatus:"${
    crResponse.clanChestStatus
  }", clanScore:${crResponse.clanScore}, clanWarTrophies:${
    crResponse.clanWarTrophies
  }, description: "${crResponse.description}", donationsPerWeek:${
    crResponse.donationsPerWeek
  }, name: "${crResponse.name}", members: ${crResponse.members}, type:"${
    crResponse.type
  }") { tag badgeId clanChestLevel clanChestMaxLevel clanChestPoints clanScore clanWarTrophies donationsPerWeek name members type } }
`.trim();
};

export const clanTag = async (_: any, { tag }: any, __: any) => {
  try {
    const clan = await getClan(tag);
    if (!clan) {
      throw new Error('Cant find clan with tag');
    }
    const existingClan = await findClan(tag);
    await execMutation(clanMutation(clan, !existingClan));
    const newTags = clan.memberList.map(m => m.tag);
    logger.info(`Clan has ${newTags.length} members`);
    const nstm = Array.from(newTags).map(generatePlayerTagMutation);
    const newPlayers = await Promise.all(nstm.map(execMutation));
    const tm = clan.memberList.map(generateClanMemberListMutations(clan));
    await Promise.all(tm.map(execMutation));
    logger.info(`${newPlayers.filter(m => !!m).length} persisted`);
    return clan;
  } catch (e) {
    return e;
  }
};
