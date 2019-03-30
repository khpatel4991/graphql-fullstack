import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Subscription {
    clanUpsert: Clan!
    playerUpsert: Player!
  }

  type Query {
    clans: [Clan!]
    me: User
    players: [Player!]
    users: [User!]
  }

  type Mutation {
    battleLog(playerTag: String!): [Battle!]!
    clanTag(tag: String!): Clan
    login(email: String!, password: String!): User
    playerTag(tag: String!): Player
    register(email: String!, password: String!): Boolean!
    stripeSource(source: String!): User!
  }

  type PlayerClan {
    badgeId: String!
    name: String!
    tag: String!
  }

  type BattlePlayerCard {
    name: String!
    level: Int!
    maxLevel: Int!
    iconUrls: [IconUrls!]!
  }

  type BattlePlayer {
    cards: [BattlePlayerCard!]!
    clan: PlayerClan!
    crowns: Int!
    kingTowerHitPoints: Int!
    name: String!
    princessTowersHitPoints: [Int!]!
    startingTrophies: Int!
    tag: String!
    trophyChange: Int
  }

  type Battle {
    arena: Arena!
    battleTime: String!
    deckSelection: String!
    gameMode: GameMode!
    isLadderTournament: Boolean!
    opponent: [BattlePlayer!]!
    team: [BattlePlayer!]!
    type: String!
  }

  type User {
    id: ID!
    email: String!
    stripeId: String
    type: String!
  }

  type ClanMember {
    arena: Arena!
    clanChestPoints: Int!
    clanRank: Int!
    donations: Int!
    donationsReceived: Int!
    expLevel: Int!
    name: String!
    previousClanRank: Int!
    role: String!
    tag: String!
    trophies: Int!
  }

  type Clan {
    id: ID!
    badgeId: Int!
    clanChestLevel: Int!
    clanChestMaxLevel: Int!
    clanChestPoints: Int!
    clanChestStatus: String!
    clanScore: Int!
    clanWarTrophies: Int
    description: String!
    donationsPerWeek: Int!
    location: Location!
    memberList: [ClanMember!]!
    members: Int!
    name: String!
    requiredTrophies: Int!
    tag: String!
    type: String!
  }

  type Location {
    id: Int!
    name: String!
    isCountry: Boolean!
    countryCode: String!
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
    clan: PlayerClan!
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
    id: String!
    name: String!
  }

  type GameMode {
    id: Int!
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
