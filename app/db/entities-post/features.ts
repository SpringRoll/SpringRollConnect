import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsInt } from 'class-validator';

@Entity()
export class Features {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  webworkers: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  websockets: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  webaudio: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  geolocation: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  webgl: boolean;
}
