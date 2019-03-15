import { Entity, Column, ObjectIdColumn, Binary, ObjectID } from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsLowercase,
  IsDate,
  IsInt,
  Min,
  Max,
  IsMongoId
} from 'class-validator';

@Entity({ name: 'groups' })
export class Group {
  @IsMongoId()
  @ObjectIdColumn({ name: '_id' })
  id: ObjectID;

  @IsString()
  @Column({ nullable: false })
  name: string;

  @IsBoolean()
  @Column({ nullable: false })
  isUserGroup: boolean;

  @IsString()
  @IsLowercase()
  @Column({ nullable: false, unique: true })
  slug: string;

  @IsString()
  @Column({ nullable: false, unique: true })
  token: string;

  @IsDate()
  @Column()
  tokenExpires: Date;

  @IsInt()
  @Min(0)
  @Max(2)
  @Column({ nullable: false, default: 0 })
  privilege: number;

  @Column({ type: 'binary' })
  logo: Binary;
}
