import { gql } from 'apollo-server';
import { getPlayerBattleLog } from '../crApi';
import { Battle } from '../entity/Battle';
import { client } from '../client';
import {
  findPlayer,
  generateBattleTeamMutations,
  generateBattleOpponentMutations,
  execMutation,
  queryBattle,
} from '../g';
import { playerTag as pt } from '.';

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
  try {
    const existingPlayer = await findPlayer(playerTag);
    if (!existingPlayer) {
      throw new Error('Please add player first');
    }
    const responseBattles = await getPlayerBattleLog(playerTag);
    if (!responseBattles) {
      throw new Error('No battles');
    }
    const battles = responseBattles.map(enhanceBattle);
    const ebids = new Set<string>(existingPlayer.asTeam.map(b => b.id));
    const newBattles = battles.filter(b => !ebids.has(b.id));
    const mutations = newBattles.map(generateMutations);
    const bmp = mutations.map(execMutation);
    await Promise.all(bmp);
    const newTags = new Set(
      battles.flatMap(b =>
        b.team.map(t => t.tag).concat(b.opponent.map(o => o.tag))
      )
    );
    newTags.delete(playerTag);
    const nstm = Array.from(newTags).map(tag =>
      pt(undefined, { tag }, undefined)
    );
    const newPlayers = await Promise.all(nstm);
    const clanTags = newPlayers
      .filter(p => p.clan && p.clan.tag)
      .map(p => p.clan.tag);
    const tm = battles.map(generateBattleTeamMutations);
    const om = battles.map(generateBattleOpponentMutations);
    const all = [...tm, ...om];
    await Promise.all(all.map(execMutation));
    const bq = queryBattle();
    const { data } = await client.query({
      query: gql(bq),
    });
    return {
      battles: data.battles,
      clanTags,
      players: newPlayers,
    };
  } catch (e) {
    return e;
  }
};
