import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('province')
export class ProvinceEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string
}