import { Entity, Column } from 'typeorm';
import { IsBoolean, ValidateNested } from 'class-validator';

@Entity()
export class Ui {
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  mouse?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  touch?: boolean;
}

@Entity()
export class Sizes {
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  xsmall?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  small?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  medium?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  large?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  xlarge?: boolean;
}

@Entity()
export class Features {
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  webworkers?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  websockets?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  webaudio?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  geolocation?: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  webgl?: boolean;
}

@Entity()
export class Capabilities {
  @ValidateNested()
  @Column()
  ui?: Ui;

  @ValidateNested()
  @Column(type => Sizes)
  sizes?: Sizes;

  @ValidateNested()
  @Column(type => Features)
  features?: Features;
}
