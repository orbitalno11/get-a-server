import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('zone')
export class ZoneEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string
}