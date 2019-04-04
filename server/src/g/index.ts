import { Battle } from '../entity/Battle';
import { Player } from '../entity/Player';
import { client } from '../client';
import { gql } from 'apollo-server';

export const findPlayer = async (tag: string): Promise<Player | null> => {
  try {
    const query = /* GraphQL */ `
      player: Player(tag: "${tag}") { tag battleCount bestTrophies challengeCardsWon losses name starPoints totalDonations trophies warDayWins wins }
    `;
    const result = await client.query({
      query: gql(`query{${query}}`),
      fetchPolicy: 'network-only',
    });
    return result.data.player[0];
  } catch (e) {
    return null;
  }
};

export const generateBattleTeamMutations = (battle: Battle, i: number) => {
  const q = battle.team
    .map(
      (t, j) => /* GraphQL */ `
    btm${i}${j}: AddBattleTeam(
      from: { id:"${battle.id}" },
      to: { tag:"${t.tag}" },
      data: {
        id: "${battle.id}:t"
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
  return `mutation{${q}}`;
};
export const generateBattleOpponentMutations = (battle: Battle, i: number) => {
  const q = battle.opponent
    .map(
      (t, j) => /* GraphQL */ `
    bom${i}${j}: AddBattleOpponent(
      from: { id:"${battle.id}" },
      to: { tag:"${t.tag}" },
      data: {
        id: "${battle.id}:o"
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
  return `mutation{${q}}`;
};

export const generatePlayerTagMutation = (tag: string, i: number) => {
  const m = /* GraphQL */ `
    t${i}: playerTag(tag: "${tag}") {
      bestTrophies
      name
      tag
      trophies
    }
  `.trim();
  return `mutation{${m}}`;
};
