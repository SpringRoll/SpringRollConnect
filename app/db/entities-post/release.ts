import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { Capabilities } from './capabilities';
import { IsIn, IsString, IsUrl, IsInt, IsNumber } from 'class-validator';
import { Game } from './game';
import { User } from './user';

enum ReleaseTypes {
  'dev' = 'dev',
  'qa' = 'qa',
  'stage' = 'stage',
  'prod' = 'prod'
}

@Entity()
export class Release {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @ManyToOne(type => Game, game => game.id, { cascadeAll: false })
  game: Game;

  @IsString()
  @Column({ type: 'text' })
  version: string;

  @IsString()
  @IsIn(['dev', 'qa', 'stage', 'prod'])
  @Column({
    nullable: false,
    type: 'text',
    enum: ReleaseTypes
  })
  status: string;

  @IsString()
  @Column({ type: 'text', unique: true, nullable: false })
  commitId: string;

  @IsString()
  @Column({ type: 'text' })
  branch: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @IsInt()
  @ManyToOne(type => User, user => user.id, { cascadeAll: false })
  updatedBy: User;

  @IsString()
  @Column({ type: 'text' })
  notes: string;

  @IsString()
  @IsUrl()
  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'bigint', nullable: false, default: 0 })
  debugUncompressedSize: number;

  @IsNumber()
  @Column({ type: 'bigint', nullable: false, default: 0 })
  debugCompressedSize: number;

  @IsNumber()
  @Column({ type: 'bigint', nullable: false, default: 0 })
  releaseCompressedSize: number;

  @IsNumber()
  @Column({ type: 'bigint', nullable: false, default: 0 })
  releaseUncompressedSize: number;

  @ManyToOne(type => Capabilities, capabilities => capabilities.id)
  capabilities: Capabilities;
}
