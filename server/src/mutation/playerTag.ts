import { gql } from 'apollo-server';
import { uniq } from 'lodash';
import { client } from '../client';
import { getPlayer, getPlayerBattleLog } from '../crApi';
import { Player } from '../entity/Player';
import { Battle } from '../entity/Battle';

const findPlayer = async (tag: string): Promise<Player> => {
  const query = /* GraphQL */ `
    player: Player(tag: "${tag}") {
      tag
    }
  `;
  const result = await client.query({
    query: gql(`query{${query}}`),
    fetchPolicy: 'network-only',
  });
  return result.data.player[0];
};

const battleMutation = (battle: Battle, i: number) => {
  const Entity = 'Battle';
  const id = `${battle.team.map(p => p.tag)}:${battle.battleTime}`;
  const teamm = i =>
    battle.team.map((t, j) =>
      /* GraphQL */ `
    bt${i}${j}: AddBattleTeam(from: { id:"${id}" }, to: { tag:"${
        t.tag
      }" }, data: { crowns: ${
        t.crowns
      }, kingTowerHitPoints:${t.kingTowerHitPoints ||
        0}, princessTowersHitPoints:[${t.princessTowersHitPoints ||
        ''}], startingTrophies:${t.startingTrophies ||
        0}, trophyChange:${t.trophyChange || 0} }) { from { id } }
  `.trim()
    );
  const opponentm = i =>
    battle.opponent.map((t, j) =>
      /* GraphQL */ `
    bo${i}${j}: AddBattleOpponent(from: { id:"${id}" }, to: { tag:"${
        t.tag
      }" }, data: { crowns: ${
        t.crowns
      }, kingTowerHitPoints:${t.kingTowerHitPoints ||
        0}, princessTowersHitPoints:[${t.princessTowersHitPoints ||
        ''}], startingTrophies:${t.startingTrophies ||
        0}, trophyChange:${t.trophyChange || 0} }) { from { id } }
  `.trim()
    );
  return /* GraphQL */ `
    battle${i}: Create${Entity}(id: "${id}", battleTime: { formatted:"${
    battle.battleTime
  }" }, isLadderTournament:${battle.isLadderTournament}, type: "${
    battle.type
  }") { id }${teamm(i)}${opponentm(i)}
  `.trim();
};

const playerMutation = (crResponse: Player, create = true) => {
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
  }", starPoints:${crResponse.starPoints}, threeCrownWins:${
    crResponse.threeCrownWins
  }, totalDonations:${crResponse.totalDonations}, tournamentBattleCount:${
    crResponse.tournamentBattleCount
  }, tournamentCardsWon:${crResponse.tournamentCardsWon}, trophies:${
    crResponse.trophies
  }, warDayWins:${crResponse.warDayWins}, wins:${
    crResponse.wins
  }) { tag battlesAsTeam { battleTime { formatted } } }
    }
  `.trim();
};

export const playerTag = async (_: any, { tag }: any, __: any) => {
  try {
    const player = await getPlayer(tag);
    if (!player) {
      throw new Error('Cant find player with tag');
    }
    const existingPlayer = await findPlayer(tag);
    const { data } = await client.mutate({
      mutation: gql(playerMutation(player, !existingPlayer)),
    });
    const ts = data.player.battlesAsTeam.map(b => b.battleTime.formatted);
    const set = new Set(ts);
    const battles = await getPlayerBattleLog(tag);
    if (!battles) {
      throw new Error('Cant find battles for player');
    }
    const newBattles = battles.filter(b => !set.has(b.battleTime));
    const tags = newBattles.flatMap(b =>
      b.team.map(p => p.tag).concat(b.opponent.map(p => p.tag))
    );
    const uniqTags = uniq(tags);
    const fetchTags = uniqTags.map(t => {
      return new Promise(async resolve => {
        try {
          const existingPlayer = await findPlayer(t);
          const p = await getPlayer(t);
          if (p) {
            await client.mutate({
              mutation: gql(playerMutation(p, !existingPlayer)),
            });
          }
          resolve();
        } catch (e) {
          console.log(`Inner e: ${e.message}`);
          resolve();
        }
      });
    });
    await Promise.all(fetchTags);
    console.log(uniqTags);
    const bm = newBattles.map(battleMutation);
    const bms = `mutation{${bm.join()}}`;
    await client.mutate({
      mutation: gql(bms),
    });
    return player;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return e;
  }
};
