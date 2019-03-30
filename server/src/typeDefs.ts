import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Subscription {
    playerUpsert: Player
  }

  type Query {
    me: User
    users: [User!]
    players: [Player!]
  }

  type Mutation {
    stripeSource(source: String!): User!
    login(email: String!, password: String!): User
    playerTag(tag: String!): Player
    register(email: String!, password: String!): Boolean!
  }

  type Clan {
    tag: String!
    name: String!
    badgeId: String!
  }

  type User {
    id: ID!
    email: String!
    stripeId: String
    type: String!
  }

  type Player {
    id: ID!
    achievements: [Achievement!]!
    arena: Arena!
    badges: [Badge!]!
    battleCount: Int!
    bestTrophies: Int!
    cards: [Card!]!
    challengeCardsWon: Int!
    challengeMaxWins: Int!
    clan: Clan!
    clanCardsCollected: Int!
    currentDeck: [Card!]!
    currentFavouriteCard: Card!
    donations: Int!
    donationsReceived: Int!
    expLevel: Int!
    leagueStatistics: LeagueStatistics!
    losses: Int!
    name: String!
    role: String!
    starPoints: Int!
    tag: String!
    threeCrownWins: Int!
    totalDonations: Int!
    tournamentBattleCount: Int!
    tournamentCardsWon: Int!
    trophies: Int!
    warDayWins: Int!
    wins: Int!
  }

  type IconUrls {
    medium: String!
  }

  type Card {
    id: String!
    count: Int!
    iconUrls: IconUrls!
    level: Int!
    maxLevel: Int!
    name: String!
  }

  type Achievement {
    info: String!
    name: String!
    stars: Int!
    target: Int!
    value: Int!
  }

  type Badge {
    level: Int
    maxLevel: Int
    name: String!
  }

  type Arena {
    is: String!
    name: String!
  }

  type CurrentSeason {
    bestTrophies: Int!
    trophies: Int!
  }

  type PreviousSeason {
    id: String!
    bestTrophies: Int!
    trophies: Int!
  }

  type BestSeason {
    id: String!
    trophies: Int!
  }

  type LeagueStatistics {
    bestSeason: BestSeason!
    currentSeason: CurrentSeason!
    previousSeason: PreviousSeason!
  }
`;
