import { Min, IsInt } from 'class-validator';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Config {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Min(0)
  @Column({ type: 'int4', nullable: false, default: 90 })
  devExpireDays: number;

  @IsInt()
  @Min(0)
  @Column({ type: 'int4', nullable: false, default: 20 })
  maxDevReleases: number;

  @Column({ type: 'text', nullable: true })
  embedScriptPlugin: string;

  @Column({ type: 'text', nullable: true })
  embedCssPlugin: string;

  @Column({ type: 'text', nullable: true })
  embedDebugScriptPlugin: string;

  @Column({ type: 'text', nullable: true })
  embedDebugCssPlugin: string;
}
