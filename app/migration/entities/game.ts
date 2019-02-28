import {
  Entity,
  Column,
  ObjectID,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Binary
} from 'typeorm';
import { Capabilities } from './capabilities';
import {
  IsString,
  IsUUID,
  IsUrl,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsMongoId,
  Matches,
  IsOptional,
  IsDefined
} from 'class-validator';
import { v4 } from 'uuid';

interface GroupPermission {
  _id: ObjectID;
  group: ObjectID;
  permission: number;
}

@Entity({ name: 'games' })
export class Game {
  @IsMongoId()
  @ObjectIdColumn({ name: '_id' })
  id: ObjectID;

  @IsString()
  @Column({ nullable: false })
  title: string;

  @IsString()
  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
  @Column({ unique: true, nullable: false })
  slug: string;

  @IsUUID('4')
  @Column({ unique: true, nullable: false })
  bundleId: string;

  @IsUrl()
  @Column({ nullable: false })
  repository: string;

  @IsUrl()
  @Column({ nullable: false })
  location: string;

  @IsBoolean()
  @Column({ nullable: false, default: false })
  isArchived: boolean;

  @IsString()
  @Column()
  description: string;

  @IsDate()
  @CreateDateColumn()
  created: Date;

  @IsDate()
  @UpdateDateColumn()
  updated: Date;

  @IsOptional()
  @ValidateNested()
  @Column(type => Capabilities)
  capabilities: Capabilities;

  @IsMongoId({ each: true })
  @IsDefined()
  @Column({ nullable: false, default: [] })
  releases: ObjectID[];

  @IsMongoId({ each: true })
  @IsDefined()
  @Column({ nullable: false, default: [] })
  groups: GroupPermission[];

  @Column()
  thumbnail: Binary;

  constructor() {
    const date = new Date();
    this.capabilities = new Capabilities();
    this.releases = [];
    this.groups = [];
    this.bundleId = v4();
    this.updated = date;
    this.updated = date;
    this.isArchived = false;
  }
}
