import {
  Entity,
  BaseEntity,
  JoinColumn,
  OneToOne,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './Player';
import { Battle } from './Battle';

export enum PlayerBattleRole {
  TEAM = 'team',
  OPPONENT = 'opponent',
}

@Entity('clash_player_battles')
export class PlayerBattle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: PlayerBattleRole })
  as: PlayerBattleRole;
  @OneToOne(_ => Battle)
  @JoinColumn({ name: 'battleId' })
  battle: Battle;
  @OneToOne(_ => Player)
  @JoinColumn({ name: 'playerId' })
  player: Player;
}
