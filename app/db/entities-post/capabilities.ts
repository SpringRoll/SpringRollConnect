import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';
import { IsInt } from 'class-validator';
import { Ui } from './ui';
import { Sizes } from './sizes';
import { Features } from './features';

@Entity()
export class Capabilities {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @ManyToOne(type => Sizes, sizes => sizes.id, {
    cascadeAll: false,
    eager: true
  })
  sizes: Sizes;

  @IsInt()
  @ManyToOne(type => Ui, ui => ui.id, { cascadeAll: false, eager: true })
  ui: Ui;

  @IsInt()
  @ManyToOne(type => Features, features => features.id, {
    cascadeAll: false,
    eager: true
  })
  features: Features;
}
