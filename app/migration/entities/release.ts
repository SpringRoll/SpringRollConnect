import {
  Entity,
  ObjectID,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/;
import { Capabilities } from './capabilities';
import { IsIn, IsString, IsMongoId, IsUrl, Matches } from 'class-validator';

@Entity({ name: 'releases' })
export class Release {
  @IsMongoId()
  @ObjectIdColumn()
  game: ObjectID;

  @IsString()
  @Matches(semver)
  @Column()
  version: string;

  @IsString()
  @IsIn(['dev', 'qa', 'stage', 'prod'])
  @Column({
    nullable: false,
    type: 'enum',
    enum: ['dev', 'qa', 'stage', 'prod'],
    unique: true
  })
  status: string;

  @IsString()
  @Column({ unique: true, nullable: false })
  commitId: string;

  @IsString()
  @Column()
  branch: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @IsMongoId()
  @Column({ type: 'json', nullable: true })
  updatedBy: ObjectID;

  @IsString()
  @Column()
  notes: string;

  @IsString()
  @IsUrl()
  @Column()
  url: string;

  @IsString()
  @Column({ nullable: false, default: '0' })
  debugCompressedSize: string;

  @IsString()
  @Column({ nullable: false, default: '0' })
  releaseCompressedSize: string;

  @IsString()
  @Column({ nullable: false, default: '0' })
  releaseUncompressedSize: string;

  @Column()
  capabilities: Capabilities;
}
