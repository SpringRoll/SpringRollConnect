import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  Generated
} from 'typeorm';
import { Capabilities } from './capabilities';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  ValidateNested,
  IsBase64
} from 'class-validator';
import { Release } from './release';
import { Group } from './group';

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

  @IsUUID('4')
  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
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
  @Column({ type: 'text' })
  description: string;

  @IsDate()
  @CreateDateColumn()
  created: Date;

  @IsDate()
  @UpdateDateColumn()
  updated: Date;

  @IsInt()
  @ManyToOne(type => Capabilities, capabilities => capabilities.id, {
    cascadeAll: false,
    nullable: false
  })
  capabilities: Capabilities;

  @ValidateNested({ each: true })
  @OneToMany(type => Release, release => release.id, {
    cascadeInsert: false,
    cascadeUpdate: false
  })
  releases: Release[];

  @ValidateNested({ each: true })
  @ManyToMany(type => Group, group => group.id, {
    cascadeInsert: false,
    cascadeUpdate: false
  })
  groups: Group[];

  @IsBase64()
  @Column({ type: 'text', nullable: true })
  thumbnail?: string;
}
