import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  getRepository
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsLowercase,
  IsString,
  IsInt,
  IsDefined
} from 'class-validator';
import { Group } from './group';
import { Game } from './game';
import { GroupPermission } from './group-permission';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined()
  @IsString()
  @IsLowercase()
  @Column({ type: 'text', unique: true, nullable: false })
  username: string;

  @IsDefined()
  @IsString()
  @Column({ type: 'text', nullable: false, select: false })
  password: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

  @IsInt({ each: true })
  @ManyToMany(type => Group, group => group.id, {
    eager: true
  })
  @JoinTable({ name: 'user_groups' })
  groups: Group[];

  @IsDefined()
  @IsString()
  @Column({ type: 'text', nullable: false })
  name: string;

  @IsString()
  @Column({ type: 'text', nullable: true })
  resetPasswordToken?: string;

  @IsDate()
  @Column({ type: 'date', nullable: true })
  resetPasswordExpires?: Date;

  async getGames({ skip = 0, take = 24 } = {}) {
    return await getRepository(GroupPermission)
      .find({
        cache: true,
        where: this.groups.map(({ id }) => ({ groupID: id })),
        select: ['gameID']
      })
      .then(gameIds => {
        return getRepository(Game).findAndCount({
          cache: true,
          take,
          skip,
          relations: ['releases'],
          where: gameIds.map(({ gameID }) => ({
            id: gameID
          })),
          order: {
            updated: 'DESC'
          }
        });
      });
  }

  async refreshPersonalAccessToken() {
    const userGroup = this.groups.find(({ isUserGroup }) => isUserGroup);
    await userGroup.refreashToken();
    return this;
  }
}
