import { gql } from 'apollo-server';
import { client } from '../client';
import { getClan } from '../crApi';
import { Clan } from '../entity/Clan';

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
  c1: ${pre}(tag:"${crResponse.tag}", badgeId:${
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
  }") { tag } }
`.trim();
};

export const clanTag = async (_: any, { tag }: any, __: any) => {
  try {
    const clan = await getClan(tag);
    if (!clan) {
      throw new Error('Cant find clan with tag');
    }
    const existingClan = await findClan(tag);
    await client.mutate({
      mutation: gql(clanMutation(clan, !existingClan)),
    });
    return clan;
  } catch (e) {
    return e;
  }
};
