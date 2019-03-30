import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Arena } from './Player';

export type Location = {
  id: number;
  name: string;
  isCountry: boolean;
  countryCode: string;
};

export type ClanMember = {
  arena: Arena;
  clanChestPoints: number;
  clanRank: number;
  donations: number;
  donationsReceived: number;
  expLevel: number;
  name: string;
  previousClanRank: number;
  role: string;
  tag: string;
  trophies: number;
};

@Entity('clash_clans')
export class Clan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  badgeId: number;
  @Column('integer')
  clanChestLevel: number;
  @Column('integer')
  clanChestMaxLevel: number;
  @Column('integer')
  clanChestPoints: number;
  @Column('varchar')
  clanChestStatus: string;
  @Column('integer')
  clanScore: number;
  @Column('integer')
  clanWarTrophies: number;
  @Column('varchar')
  description: string;
  @Column('integer')
  donationsPerWeek: number;
  @Column('jsonb')
  location: Location;
  @Column('jsonb')
  memberList: ClanMember[];
  @Column('integer')
  members: number;
  @Column('varchar')
  name: string;
  @Column('integer')
  requiredTrophies: number;
  @Column('varchar', { unique: true })
  tag: string;
  @Column('varchar')
  type: string;
}
