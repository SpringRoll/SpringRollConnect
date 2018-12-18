import { Entity, Column, Binary, PrimaryGeneratedColumn } from 'typeorm';
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

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ type: 'text', nullable: false })
  name: string;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false })
  isUserGroup: boolean;

  @IsString()
  @IsLowercase()
  @Column({ type: 'text', nullable: false, unique: true })
  slug: string;

  @IsString()
  @Column({ type: 'text', nullable: false, unique: true })
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
}
