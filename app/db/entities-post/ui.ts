import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsInt, IsBoolean } from 'class-validator';

@Entity()
export class Ui {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  mouse: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  touch: boolean;
}
