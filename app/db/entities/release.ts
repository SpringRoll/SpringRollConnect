import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import {
  IsIn,
  IsInstance,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  IsDate,
  IsUUID,
  ValidateNested,
  Length,
  IsDefined
} from 'class-validator';
import { Game } from './game';
import { User } from './';

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

  @IsUUID()
  @IsDefined()
  @Column({ type: 'uuid' })
  gameUuid: string;

  @ValidateNested()
  @ManyToOne(type => Game, game => game.releases, {})
  game: Game;

  @IsString()
  @Column({ type: 'text', nullable: true })
  version: string;

  @IsString()
  @IsIn(['dev', 'qa', 'stage', 'prod'])
  @IsDefined()
  @Column({
    nullable: false,
    type: 'text',
    enum: ReleaseTypes
  })
  status: string;

  @IsString()
  @Length(40, 40)
  @IsDefined()
  @Column({ type: 'text', unique: true, nullable: false })
  commitId: string;

  @IsString()
  @Column({ type: 'text', nullable: true })
  branch: string;

  @IsDate()
  @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
  created: Date;

  @IsDate()
  @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
  updated: Date;

  @IsInt()
  @Column({ type: 'int4', nullable: true })
  updatedById: number;

  @ValidateNested()
  @ManyToOne(type => User, user => user.id, {
    nullable: true
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;

  @IsString()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @IsString()
  @IsUrl()
  @Column({ type: 'text', nullable: true })
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

  @IsInstance(Object)
  @Column({ type: 'jsonb' })
  capabilities: object;
}
