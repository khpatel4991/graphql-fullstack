import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

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

  @Column('text', { nullable: true, unique: true })
  playerTag: string;

  @Column('text', { default: 'free-trial' })
  type: string;
}
