import { IsNumber, Min } from 'class-validator';
import { Column } from 'typeorm';

export class Config {
  @IsNumber()
  @Min(0)
  @Column({ nullable: false, default: 90 })
  devExpireDays: number;

  @IsNumber()
  @Min(0)
  @Column({ nullable: false, default: 20 })
  maxDevReleases: number;

  @Column()
  embedScriptPlugin: string;

  @Column()
  embedCssPlugin: string;

  @Column()
  embedDebugScriptPlugin: string;

  @Column()
  embedDebugCssPlugin: string;
}
