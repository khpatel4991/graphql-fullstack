import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Arena, Player } from './Player';

@Entity('clash_battles')
export class Battle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  arena: Arena;

  @Column('varchar')
  battleTime: string;

  @Column('varchar')
  deckSelection: string;

  @Column('jsonb')
  gameMode: string;

  @Column('jsonb')
  team: Array<Player>;

  @Column('jsonb')
  opponent: Array<Player>;

  @Column('bool')
  isLadderTournament: boolean;

  @Column('varchar')
  type: string;
}
