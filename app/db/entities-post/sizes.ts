import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsInt, IsBoolean } from 'class-validator';

@Entity()
export class Sizes {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  xsmall: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  small: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  medium: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  large: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  xlarge: boolean;
}
