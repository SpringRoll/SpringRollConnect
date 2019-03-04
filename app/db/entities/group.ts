import { Entity, Column, PrimaryGeneratedColumn, getRepository } from 'typeorm';
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
import { PassportStatic } from 'passport';
const passport: PassportStatic = require('passport');

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
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
  @Column({ type: 'text', nullable: true })
  logo?: string;

  async refreashToken(tokenExpires: false | Date = false) {
    if (tokenExpires) {
      this.tokenExpires = tokenExpires;
    }

    this.token = randomBytes(20).toString('hex');
    await getRepository(Group).save(this);
  }
}
