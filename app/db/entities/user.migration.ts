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
  IsDefined,
  ValidateNested
} from 'class-validator';
import { Group } from './group';
import { Game } from './game';
import { GroupPermission } from './group-permission';

interface getGameArgs {
  skip?: number;
  take?: number;
  order?: string;
  where?: any;
}

@Entity({ name: 'springroll_user' })
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

  @ValidateNested({ each: true })
  @ManyToMany(type => Group, group => group.users, {
    eager: true
    // cascadeInsert: true,
    //cascadeUpdate: true
  })
  @JoinTable({ name: 'user_groups' })
  groups: Array<Group>;

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

  async getPermittedGameIds() {
    return await getRepository(GroupPermission)
      .find({
        cache: true,
        where: this.groups.map(({ id }) => ({ groupID: id })),
        select: ['gameID']
      })
      .then(ids => ids.map(({ gameID }) => gameID));
  }

  async getGame(
    where: any,
    relation = ''
  ): Promise<{ game: Game; permission: number; token: string }> {
    const query = getRepository(Game)
      .createQueryBuilder('game')
      .cache(true)
      .leftJoinAndSelect('game.releases', 'releases');

    if (relation) {
      query.leftJoinAndSelect(`game.${relation}`, relation);
    }

    return query
      .where(where)
      .orderBy('releases.updated', 'DESC')
      .getOne()
      .then(game =>
        getRepository(GroupPermission)
          .findOne({
            where: this.groups.map(({ id }) => ({
              cache: true,
              gameID: game.uuid,
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
    return this.getGame(where).then(({ permission }) => permission);
  }

  async canReadGame(where: any) {
    return 0 <= (await this.getGamePermission(where));
  }

  async canEditGame(where: any) {
    return 1 <= (await this.getGamePermission(where));
  }

  async canAdminGame(where: any) {
    return 2 <= (await this.getGamePermission(where));
  }

  async refreshPersonalAccessToken() {
    const userGroup = this.groups.find(({ isUserGroup }) => isUserGroup);
    await userGroup.refreshToken();
    return this;
  }
}