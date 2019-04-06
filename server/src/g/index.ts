import { gql } from 'apollo-server';
import { FetchResult } from 'apollo-link';
import { Battle } from '../entity/Battle';
import { Player, Card } from '../entity/Player';
import { client } from '../client';
import { Clan, ClanMember } from '../entity/Clan';
import { logger } from '../logger';

const clean = str => str.replace(/\r?\n?/g, '').replace(/\s+/g, ' ');

export const execMutation = (m: string): Promise<FetchResult<any>> => {
  return new Promise(async resolve => {
    try {
      const result = await client.mutate({
        mutation: gql(m),
        fetchPolicy: 'no-cache',
      });
      logger.debug(`[M]:"${clean(m)}"`);
      resolve(result);
    } catch (e) {
      logger.debug(e);
      logger.error(`[M]:"${clean(m)}, reason: ${e}"`);
      resolve(e);
    }
  });
};

export const generatePlayerCurrentDeckMutations = (player: Player) => (
  card: Card,
  i: number
) => {
  const m = /* GraphQL */ `
    gpcm${i}: AddPlayerCurrentDeck(
      from: { id: ${card.id} },
      to: { tag: "${player.tag}" },
      data: { level: ${card.level} }
    )
    { from { id } to { tag } }
  `;
  return `mutation{${m}}`;
};

export const generatePlayerFavouriteCardMutation = (player: Player) => (
  card: Card,
  i: number
) => {
  const m = /* GraphQL */ `
    gpcfcm${i}: AddPlayerCurrentFavouriteCard(
      from: { id: ${card.id} },
      to: { tag: "${player.tag}" }
    )
    { from { id } to { tag } }
  `;
  return `mutation{${m}}`;
};

export const generateClanMemberListMutations = (clan: Clan) => (
  player: ClanMember,
  i: number
) => {
  const m = /* GraphQL */ `
    cml${i}: AddClanMemberList(
      from: { tag: "${clan.tag}" },
      to: { tag: "${player.tag}" },
      data: {
        clanChestPoints: ${player.clanChestPoints || 0},
        clanRank: ${player.clanRank},
        donations: ${player.donations},
        donationsReceived: ${player.donationsReceived},
        expLevel: ${player.expLevel},
        previousClanRank: ${player.previousClanRank},
        role: "${player.role}"
      }
    ) { from { tag } to { tag } }
  `;
  return `mutation{${m}}`;
};

export const generateBattleTeamMutations = (battle: Battle, i: number) => {
  const m = battle.team
    .map(
      (t, j) => /* GraphQL */ `
    btm${i}${j}: AddBattleTeam(
      from: { id:"${battle.id}" },
      to: { tag:"${t.tag}" },
      data: {
        id: "${battle.id}:t",
        crowns: ${t.crowns},
        kingTowerHitPoints:${t.kingTowerHitPoints || 0},
        princessTowersHitPoints:[${t.princessTowersHitPoints || ''}],
        startingTrophies:${t.startingTrophies || 0},
        trophyChange:${t.trophyChange || 0} }
      )
      { from { id team { crowns } } to { tag } id crowns kingTowerHitPoints startingTrophies }
      `
    )
    .join('');
  return `mutation{${m}}`;
};
export const generateBattleOpponentMutations = (battle: Battle, i: number) => {
  const m = battle.opponent
    .map(
      (t, j) => /* GraphQL */ `
    bom${i}${j}: AddBattleOpponent(
      from: { id:"${battle.id}" },
      to: { tag:"${t.tag}" },
      data: {
        id: "${battle.id}:o",
        crowns: ${t.crowns},
        kingTowerHitPoints:${t.kingTowerHitPoints || 0},
        princessTowersHitPoints:[${t.princessTowersHitPoints || ''}],
        startingTrophies:${t.startingTrophies || 0},
        trophyChange:${t.trophyChange || 0} }
      )
      { from { id opponent { crowns } } to { tag } id crowns kingTowerHitPoints startingTrophies }
      `
    )
    .join('');
  return `mutation{${m}}`;
};

export const generatePlayerTagMutation = (tag: string, i: number) => {
  const m = /* GraphQL */ `
    pt${i}: playerTag(tag: "${tag}") {
      bestTrophies
      name
      tag
      trophies
    }
  `.trim();
  return `mutation{${m}}`;
};

export const findPlayer = async (tag: string): Promise<Player | null> => {
  const query = /* GraphQL */ `
    player: Player(tag: "${tag}") 
    { 
      currentFavouriteCard { name }
      currentDeck { level }
      tag
      battleCount
      bestTrophies
      challengeCardsWon
      losses
      name
      starPoints
      totalDonations
      trophies
      warDayWins
      wins
    }
  `;
  const q = `query{${query}}`;
  try {
    const result = await client.query({
      query: gql(q),
      fetchPolicy: 'network-only',
    });
    logger.debug(`[Q]: ${clean(q)}`);
    return result.data.player[0];
  } catch (e) {
    logger.error(`[Q]: ${clean(q)}`);
    return null;
  }
};

export const queryBattle = () => {
  return /* GraphQL */ `
    query {
      battles: Battle(first: 500, offset: 0) {
        id
        type
        isLadderTournament
        team {
          Player {
            tag
            trophies
          }
          kingTowerHitPoints
          princessTowersHitPoints
        }
        opponent {
          Player {
            tag
            trophies
          }
          kingTowerHitPoints
          princessTowersHitPoints
        }
      }
    }
  `;
};

export const generatePlayerMutation = (crResponse: Player, create = true) => {
  const Entity = 'Player';
  const pre = create ? `Create${Entity}` : `Update${Entity}`;
  return /* GraphQL */ `mutation {
    player: ${pre}(tag:"${crResponse.tag}", battleCount:${
    crResponse.battleCount
  }, bestTrophies:${crResponse.bestTrophies}, challengeCardsWon:${
    crResponse.challengeCardsWon
  }, challengeMaxWins:${crResponse.challengeMaxWins}, clanCardsCollected:${
    crResponse.clanCardsCollected
  }, expLevel:${crResponse.expLevel}, losses:${crResponse.losses}, name:"${
    crResponse.name
  }", starPoints:${crResponse.starPoints || 0}, threeCrownWins:${
    crResponse.threeCrownWins
  }, totalDonations:${crResponse.totalDonations}, tournamentBattleCount:${
    crResponse.tournamentBattleCount
  }, tournamentCardsWon:${crResponse.tournamentCardsWon}, trophies:${
    crResponse.trophies
  }, warDayWins:${crResponse.warDayWins}, wins:${crResponse.wins}) {
    tag battleCount bestTrophies challengeCardsWon losses name starPoints totalDonations trophies warDayWins wins }
    }
  `.trim();
};

export const generatePlayerBattleLogMutation = (tag: string, i: number) => {
  const m = /* GraphQL */ `
    t${i}: battleLog(tag: "${tag}") {
      id
      team {
        crowns
        startingTrophies
        trophyChange
      }
      opponent {
        crowns
        startingTrophies
        trophyChange
      }
      type
    }
  `.trim();
  return `mutation{${m}}`;
};

export const upsertPlayer = async (
  player: Player,
  existingPlayer: Player | null
) => {
  try {
    const m = generatePlayerMutation(player, !existingPlayer);
    const result = await execMutation(m);
    if (!result.data) {
      throw new Error('Mutation Failed');
    }
    if (
      !existingPlayer ||
      (existingPlayer &&
        existingPlayer.currentFavouriteCard.name !==
          player.currentFavouriteCard.name)
    ) {
      logger.debug(`Updating favourite card for ${player.tag}`);
      const cfccards = generatePlayerFavouriteCardMutation(player)(
        player.currentFavouriteCard,
        0
      );
      await execMutation(cfccards);
    }
    if (
      !existingPlayer ||
      (existingPlayer &&
        existingPlayer.currentDeck.some(
          (c, i) => c.name !== existingPlayer.currentDeck[i].name
        ))
    ) {
      logger.debug(`Updating current deck for ${player.tag}`);
      const pcards = player.currentDeck.map(
        generatePlayerCurrentDeckMutations(player)
      );
      await Promise.all(pcards.map(execMutation));
    }
    return result.data;
  } catch (e) {
    logger.error(e.message);
    return false;
  }
};
