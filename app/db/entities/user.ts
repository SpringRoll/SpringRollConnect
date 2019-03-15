import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  getRepository,
  FindConditions
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
import { select } from 'async';

interface getGameArgs {
  skip?: number;
  take?: number;
  order?: string;
  where?: FindConditions<Game>;
}

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

  async getGames({
    skip = 0,
    take = 24,
    order = 'alphabetical',
    where = {}
  }: getGameArgs = {}) {
    return await getRepository(GroupPermission)
      .find({
        cache: true,
        where: this.groups.map(({ id }) => ({ groupID: id })),
        select: ['gameID']
      })
      .then(gameIds =>
        getRepository(Game).findAndCount({
          cache: true,
          take,
          skip,
          relations: ['releases'],
          where: gameIds.map(({ gameID }) => ({
            ...where,
            id: gameID
          })),
          order:
            order == 'alphabetical' ? { title: 'ASC' } : { updated: 'DESC' }
        })
      );
  }

  async getGame(
    where: FindConditions<Game>,
    relations: Array<string> = []
  ): Promise<{ game: Game; permission: number; token: string }> {
    return await getRepository(Game)
      .findOne({
        cache: true,
        relations: ['releases'].concat(relations),
        where
      })
      .then(game =>
        getRepository(GroupPermission)
          .findOne({
            where: this.groups.map(({ id }) => ({
              cache: true,
              gameID: game.id,
              groupID: id
            })),
            order: { permission: 'DESC' }
          })
          .then(({ permission, group }) => ({
            game,
            permission,
            token: group.token
          }))
          .catch(err => ({ game, permission: null, token: '' }))
      );
  }

  get hasGroups(): boolean {
    return !this.groups || 1 > this.groups.length ? false : true;
  }

  get userPrivilege(): number {
    return this.hasGroups
      ? this.groups.find(({ isUserGroup }) => isUserGroup).privilege
      : -1;
  }

  get isAdmin(): boolean {
    return 2 <= this.userPrivilege;
  }

  get isEditor(): boolean {
    return 1 <= this.userPrivilege;
  }

  get isReader(): boolean {
    return 0 <= this.userPrivilege;
  }

  getGamePermission(where: any) {
    // getGamePermission(where: FindConditions<Game>) {
    return this.getGame(where).then(({ permission }) => permission);
  }

  async canReadGame(where: any) {
    // async canReadGame(where: FindConditions<Game>) {
    return 0 <= (await this.getGamePermission(where));
  }

  async canEditGame(where: any) {
    // async canEditGame(where: FindConditions<Game>) {
    return 1 <= (await this.getGamePermission(where));
  }

  async canAdminGame(where: any) {
    // async canAdminGame(where: FindConditions<Game>) {
    return 2 <= (await this.getGamePermission(where));
  }

  async refreshPersonalAccessToken() {
    const userGroup = this.groups.find(({ isUserGroup }) => isUserGroup);
    await userGroup.refreshToken();
    return this;
  }
}
