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

  @IsInt()
  @Column({ type: 'int' })
  groupID: number;

  @ValidateNested()
  @ManyToOne(type => Group, group => group.id, { eager: true, onDelete: "CASCADE" } )
  @JoinColumn({ name: 'groupID' })
  group: Group;

  @Column({ type: 'uuid' })
  gameID: string;

  @ValidateNested()
  @ManyToOne(type => Game, game => game.groups, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: 'gameID' })
  game: Game;
}
