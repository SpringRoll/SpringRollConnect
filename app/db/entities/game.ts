import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
  IsBase64,
  IsInstance
} from 'class-validator';
import { Release } from './release';
import { GroupPermission } from './group-permission';

@Entity()
export class Game {
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @IsString()
  @Column({ type: 'text', nullable: false })
  title: string;

  @IsString()
  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
  @Column({ type: 'text', unique: true, nullable: false })
  slug: string;

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
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => 'uuid_generate_v4()'
  })
  bundleId: string;

  @IsString()
  @Column({ type: 'text', default: '' })
  description: string;

  @IsDate()
  @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
  created: Date;

  @IsDate()
  @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
  updated: Date;

  @IsInstance(Object)
  @Column({ type: 'jsonb' })
  capabilities: object;

  @ValidateNested({ each: true })
  @OneToMany(type => Release, release => release.game)
  releases: Release[];

  @ValidateNested({ each: true })
  @OneToMany(type => GroupPermission, group => group.game)
  groups: GroupPermission[];

  @IsBase64()
  @Column({ type: 'bytea', nullable: true, select: false })
  thumbnail: string;
}
