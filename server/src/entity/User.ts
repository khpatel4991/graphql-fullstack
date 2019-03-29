import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from './Player';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text', { nullable: true, unique: true })
  stripeId: string;

  @Column('text', { default: 'free-trial' })
  type: string;

  @OneToOne(_ => Player)
  @JoinColumn()
  player: Player;
}
