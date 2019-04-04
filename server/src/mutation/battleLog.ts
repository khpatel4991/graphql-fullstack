import { gql } from 'apollo-server';
import { client } from '../client';
import { getPlayerBattleLog } from '../crApi';
import { Battle } from '../entity/Battle';
import { FetchResult } from 'apollo-link';
import {
  findPlayer,
  generatePlayerTagMutation,
  generateBattleTeamMutations,
  generateBattleOpponentMutations,
} from '../g';

// import { PlayerBattle } from '../entity/PlayerBattle';

const generateMutations = (battle: Battle, i: number) => {
  const Entity = 'Battle';
  const sortedTags = battle.team
    .map(t => t.tag)
    .concat(battle.opponent.map(o => o.tag))
    .sort();
  const id = `${sortedTags}:${battle.battleTime}`;
  return /* GraphQL */ `mutation {
    battle${i}: Create${Entity}(
      id: "${id}",
      battleTime: { formatted:"${battle.battleTime}" },
      isLadderTournament:${battle.isLadderTournament},
      type: "${battle.type}"
    )
    { id isLadderTournament }
  }
  `.trim();
};

const execMutation = (
  m: string
): Promise<FetchResult<{ data: any }> | false> => {
  return new Promise(async resolve => {
    try {
      const result = await client.mutate({
        mutation: gql(m),
        fetchPolicy: 'no-cache',
      });
      resolve(result);
    } catch (e) {
      resolve(false);
    }
  });
};

const enhanceBattle = battle => {
  const sortedTags = battle.team
    .map(t => t.tag)
    .concat(battle.opponent.map(o => o.tag))
    .sort();
  const id = `${sortedTags}:${battle.battleTime}`;
  const ft = battle.team.map(t => ({
    ...t,
    kingTowerHitPoints: t.kingTowerHitPoints || 0,
    princessTowersHitPoints: t.princessTowersHitPoints || [],
    startingTrophies: t.startingTrophies || 0,
    trophyChange: t.trophyChange || 0,
  }));
  const fo = battle.opponent.map(t => ({
    ...t,
    kingTowerHitPoints: t.kingTowerHitPoints || 0,
    princessTowersHitPoints: t.princessTowersHitPoints || [],
    startingTrophies: t.startingTrophies || 0,
    trophyChange: t.trophyChange || 0,
  }));
  return {
    ...battle,
    id,
    team: ft,
    opponent: fo,
  };
};

export const battleLog = async (_: any, { playerTag }: any, __: any) => {
  const existingPlayer = await findPlayer(playerTag);
  if (!existingPlayer) {
    throw new Error('Please add player first');
  }
  const responseBattles = await getPlayerBattleLog(playerTag);
  if (!responseBattles) {
    throw new Error('No battles');
  }
  const battles = responseBattles.map(enhanceBattle);
  const mutations = battles.map(generateMutations);
  const bmp = mutations.map(execMutation);
  await Promise.all(bmp);
  const newTags = new Set(
    battles.flatMap(b =>
      b.team.map(t => t.tag).concat(b.opponent.map(o => o.tag))
    )
  );
  console.log(`Encountered ${newTags.size} tags`);
  const nstm = Array.from(newTags).map(generatePlayerTagMutation);
  const newPlayers = await Promise.all(nstm.map(execMutation));
  console.log(`${newPlayers.filter(m => !!m).length} persisted`);
  const tm = battles.map(generateBattleTeamMutations);
  const om = battles.map(generateBattleOpponentMutations);
  const all = [...tm, ...om];
  const result = await Promise.all(all.map(execMutation));
  console.log(`${result.filter(m => !!m).length} persisted`);
  return battles;
};
