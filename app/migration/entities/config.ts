import { IsNumber, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'configs' })
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Min(0)
  @Column({ nullable: false, default: 90 })
  devExpireDays: number;

  @IsNumber()
  @Min(0)
  @Column({ nullable: false, default: 20 })
  maxDevReleases: number;

  @Column({ nullable: true })
  embedScriptPlugin: string;

  @Column({ nullable: true })
  embedCssPlugin: string;

  @Column({ nullable: true })
  embedDebugScriptPlugin: string;

  @Column({ nullable: true })
  embedDebugCssPlugin: string;
}
