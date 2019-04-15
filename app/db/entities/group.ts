import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  getRepository,
  ManyToMany
} from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsLowercase,
  IsDate,
  IsInt,
  Min,
  Max,
  IsBase64
} from 'class-validator';

import { randomBytes } from 'crypto';
import { User } from './';
import { GroupPermission } from './group-permission';

@Entity()
export class Group {
  @IsInt()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @Column({ type: 'text', nullable: true })
  name: string;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  isUserGroup: boolean;

  @IsString()
  @IsLowercase()
  @Column({ type: 'text', nullable: true, unique: true })
  slug: string;

  @IsString()
  @Column({ type: 'text', nullable: true, unique: true })
  token: string;

  @IsDate()
  @Column({ type: 'date', nullable: true })
  tokenExpires?: Date;

  @IsInt()
  @Min(0)
  @Max(2)
  @Column({ type: 'int2', nullable: false, default: 0 })
  privilege: number;

  @IsBase64()
  @Column({ type: 'bytea', nullable: true, default: null, select: false })
  logo?: string;

  @ManyToMany(type => User, user => user.groups)
  users: Array<User>;

  async refreshToken(tokenExpires: false | Date = false) {
    if (tokenExpires) {
      this.tokenExpires = tokenExpires;
    }

    this.token = Group.generateToken();
    await getRepository(Group).save(this);
  }

  static generateToken() {
    return randomBytes(20).toString('hex');
  }

  getPermittedGameIds() {
    return getRepository(GroupPermission)
      .find({
        select: ['gameID'],
        where: { groupID: this.id }
      })
      .then(groupPermissions => groupPermissions.map(({ gameID }) => gameID));
  }
}
