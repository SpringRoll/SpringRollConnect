import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn
} from 'typeorm';
import { IsInt, ValidateNested } from 'class-validator';
import { Group } from './group';
import { Game } from './game';

@Entity()
export class GroupPermission {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Column({ type: 'int2', default: 0, nullable: false })
  permission: number;

  @ValidateNested()
  @ManyToOne(type => Group, group => group.id, {
    cascadeInsert: false,
    cascadeRemove: false,
    cascadeUpdate: false,
    cascadeAll: false
  })
  @JoinColumn()
  group: Group;

  @ValidateNested()
  @ManyToOne(type => Game, game => game.id, {
    cascadeInsert: false,
    cascadeRemove: false,
    cascadeUpdate: false,
    cascadeAll: false
  })
  @JoinColumn()
  game: Game;
}
