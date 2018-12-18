import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { IsDate, IsEmail, IsLowercase, IsString, IsInt } from 'class-validator';
import { Group } from './group';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsLowercase()
  @Column({ type: 'text', unique: true, nullable: false })
  username: string;

  @IsString()
  @Column({ type: 'text', nullable: false, select: false })
  password: string;

  @IsString()
  @IsEmail()
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean;

  @IsInt({ each: true })
  @ManyToMany(type => Group, group => group.id, {
    eager: true,
    cascadeUpdate: false,
    cascadeInsert: false
  })
  @JoinTable()
  groups: Group[];

  @IsString()
  @Column({ type: 'text', nullable: false })
  name: string;

  @IsString()
  @Column({ type: 'text', nullable: true })
  resetPasswordToken?: string;

  @IsDate()
  @Column({ type: 'date', nullable: true })
  resetPasswordExpires?: Date;
}
