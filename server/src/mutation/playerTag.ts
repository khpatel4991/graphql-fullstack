import { gql } from 'apollo-server';
import { client } from '../client';
import { getPlayer } from '../crApi';
import { Player } from '../entity/Player';
import { findPlayer } from '../g';
// import { pubsub } from '..';
// import { PLAYER_UPDATED, PLAYER_CREATED } from '../topics';

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
  }) { tag battleCount bestTrophies challengeCardsWon losses name starPoints totalDonations trophies warDayWins wins }
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
      fetchPolicy: 'no-cache',
    });
    return data.player;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return e;
  }
};
