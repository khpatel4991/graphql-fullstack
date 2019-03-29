import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export type Clan = {
  tag: string;
  name: string;
  badgeId: number;
};

export type Arena = {
  id: number;
  name: string;
};

export type LeagueStatistics = {
  currentSeason: { trophies: number; bestTrophies: number };
  previousSeason: { id: string; trophies: number; bestTrophies: number };
  bestSeason: { id: string; trophies: number };
};
@Entity('clash_players')
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { unique: true })
  tag: string;
  @Column('varchar')
  name: string;
  @Column('integer')
  expLevel: number;
  @Column('integer')
  trophies: number;
  @Column('integer')
  bestTrophies: number;
  @Column('integer')
  wins: number;
  @Column('integer')
  losses: number;
  @Column('integer')
  battleCount: number;
  @Column('integer')
  threeCrownWins: number;
  @Column('integer')
  challengeCardsWon: number;
  @Column('integer')
  challengeMaxWins: number;
  @Column('integer')
  tournamentCardsWon: number;
  @Column('integer')
  tournamentBattleCount: number;
  @Column('varchar')
  role: string;
  @Column('integer')
  donations: number;
  @Column('integer')
  donationsReceived: number;
  @Column('integer')
  totalDonations: number;
  @Column('integer')
  warDayWins: number;
  @Column('integer')
  clanCardsCollected: number;
  @Column('integer')
  starPoints: number;
  @Column('jsonb')
  clan: Clan;
  @Column('jsonb')
  arena: Arena;
  @Column('jsonb')
  leagueStatistics: LeagueStatistics;
}
