import { IsNumber, Min, IsUrl, IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'configs' })
export class Config {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsDefined()
  @IsNumber()
  @Min(0)
  @Column({ nullable: false, default: 90 })
  devExpireDays: number;

  @IsDefined()
  @IsNumber()
  @Min(0)
  @Column({ nullable: false, default: 20 })
  maxDevReleases: number;

  @IsUrl()
  @Column({ nullable: true })
  embedScriptPlugin: string;

  @IsUrl()
  @Column({ nullable: true })
  embedCssPlugin: string;

  @IsUrl()
  @Column({ nullable: true })
  embedDebugScriptPlugin: string;

  @IsUrl()
  @Column({ nullable: true })
  embedDebugCssPlugin: string;
}
