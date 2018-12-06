import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'games' })
export class Game {
  @ObjectIdColumn()
  id: ObjectID;
  @Column({})
  title: string;
  @Column()
  slug: string;
  @Column()
  bundleId: string;
  @Column()
  repository: string;
  @Column()
  location: string;
  @Column()
  isArchived: boolean;
  @Column()
  description: string;
  @Column()
  created: Date;
  @Column()
  updated: Date;
  @Column()
  capabilities: any;
  @Column()
  releases: any;
  @Column()
  groups: any;
  @Column()
  thumbnail: Buffer;
}
