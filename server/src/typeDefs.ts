import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    me: User
    users: [User!]
    players: [Player!]
  }

  type Mutation {
    createSubscription(source: String!): User!
    login(email: String!, password: String!): User
    playerTag(tag: String!): User!
    register(email: String!, password: String!): Boolean!
  }

  type User {
    id: ID!
    email: String!
    stripeId: String
    type: String!
    player: Player
  }

  type Player {
    id: ID!
    tag: String!
    name: String!
    expLevel: Int!
    trophies: Int!
    bestTrophies: Int!
    wins: Int!
    losses: Int!
    battleCount: Int!
    threeCrownWins: Int!
    challengeCardsWon: Int!
    challengeMaxWins: Int!
    tournamentCardsWon: Int!
    tournamentBattleCount: Int!
    role: String!
    donations: Int!
    donationsReceived: Int!
    totalDonations: Int!
    warDayWins: Int!
    clanCardsCollected: Int!
    starPoints: Int!
    clan: Clan!
    arena: Arena!
    leagueStatistics: LeagueStatistics!
  }

  type Clan {
    tag: String!
    name: String!
    badgeId: String!
  }

  type Arena {
    is: String!
    name: String!
  }

  type CurrentSeason {
    trophies: Int!
    bestTrophies: Int!
  }

  type PreviousSeason {
    id: String!
    trophies: Int!
    bestTrophies: Int!
  }

  type BestSeason {
    id: String!
    trophies: Int!
  }

  type LeagueStatistics {
    currentSeason: CurrentSeason!
    previousSeason: PreviousSeason!
    bestSeason: BestSeason!
  }
`;
