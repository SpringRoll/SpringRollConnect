import { Column, ObjectIdColumn, ObjectID, Entity } from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsLowercase,
  IsMongoId,
  IsString
} from 'class-validator';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @IsString()
  @IsLowercase()
  @Column({ unique: true, nullable: false })
  username: string;

  @IsString()
  @Column({ nullable: false, select: false })
  password: string;

  @IsString()
  @IsLowercase()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @IsMongoId({ each: true })
  @Column()
  groups: ObjectID[];

  @IsString()
  @Column({ nullable: false })
  name: string;

  @IsString()
  @Column()
  resetPasswordToken: string;

  @IsDate()
  @Column()
  resetPasswordExpires: Date;
}
