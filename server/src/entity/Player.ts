import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Battle } from './Battle';

export type Achievement = {
  info: string;
  name: string;
  stars: number;
  target: number;
  value: number;
};

export type Arena = {
  id: number;
  name: string;
};

export type Badge = {
  level?: number;
  maxLevel?: number;
  name: string;
};

export type Card = {
  id: string;
  count: number;
  iconUrls: {
    medium: string;
  };
  level: number;
  maxLevel: number;
  name: string;
};

export type Clan = {
  badgeId: number;
  name: string;
  tag: string;
};
export type LeagueStatistics = {
  bestSeason: { id: string; trophies: number };
  currentSeason: { trophies: number; bestTrophies: number };
  previousSeason: { id: string; trophies: number; bestTrophies: number };
};
@Entity('clash_players')
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('jsonb')
  achievements: Achievement[];
  @Column('jsonb')
  arena: Arena;
  @Column('jsonb')
  badges: Badge[];
  @Column('integer')
  battleCount: number;
  @Column('integer')
  bestTrophies: number;
  @Column('jsonb')
  cards: Card[];
  @Column('integer')
  challengeCardsWon: number;
  @Column('integer')
  challengeMaxWins: number;
  @Column('jsonb')
  clan: Clan;
  @Column('integer')
  clanCardsCollected: number;
  @Column('integer')
  clanChestPoints: number;
  @Column('integer')
  clanRank: number;
  @Column('integer')
  crowns: number;
  @Column('jsonb')
  currentDeck: Card[];
  @Column('jsonb')
  currentFavouriteCard: Card;
  @Column('integer')
  donations: number;
  @Column('integer')
  donationsReceived: number;
  @Column('integer')
  expLevel: number;
  @Column('integer')
  kingTowerHitPoints: number;
  @Column('jsonb')
  leagueStatistics: LeagueStatistics;
  @Column('integer')
  losses: number;
  @Column('varchar')
  name: string;
  @Column('integer')
  previousClanRank: number;
  @Column('simple-array')
  princessTowersHitPoints: Array<number>;
  @Column('varchar')
  role: string;
  @Column('integer')
  starPoints: number;
  @Column('integer')
  startingTrophies: number;
  @Column('varchar', { unique: true })
  tag: string;
  @Column('integer')
  threeCrownWins: number;
  @Column('integer')
  totalDonations: number;
  @Column('integer')
  tournamentBattleCount: number;
  @Column('integer')
  tournamentCardsWon: number;
  @Column('integer')
  trophies: number;
  @Column('integer')
  trophyChange: number;
  @Column('integer')
  warDayWins: number;
  @Column('integer')
  wins: number;

  battlesAsTeam: Battle[];
  battlesAsOpponents: Battle[];
}
