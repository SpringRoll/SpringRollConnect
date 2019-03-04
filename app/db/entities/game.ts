import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
  IsBase64,
  IsInstance
} from 'class-validator';
import { Release } from './release';
import { Group } from './group';
import { GroupPermission } from './group-permission';

@Entity()
export class Game {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ type: 'text', nullable: false })
  title: string;

  @IsString()
  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
  @Column({ type: 'text', unique: true, nullable: false })
  slug: string;

  @IsString()
  @Column({ type: 'text', unique: true, nullable: false })
  // @Generated('uuid')
  bundleId: string;

  @IsUrl()
  @Column({ type: 'text', nullable: false })
  repository: string;

  @IsUrl()
  @Column({ type: 'text', nullable: false })
  location: string;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  isArchived: boolean;

  @IsString()
  @Column({ type: 'text', default: '' })
  description: string;

  @IsDate()
  @CreateDateColumn()
  created: Date;

  @IsDate()
  @UpdateDateColumn()
  updated: Date;

  @IsInstance(Object)
  @Column({ type: 'jsonb' })
  capabilities: object;

  @ValidateNested({ each: true })
  @OneToMany(type => Release, release => release.game)
  releases: Release[];

  @ValidateNested({ each: true })
  @OneToMany(type => Group, group => group.id)
  groups: GroupPermission[];

  @IsBase64()
  @Column({ type: 'text', nullable: true })
  thumbnail?: string;
}
