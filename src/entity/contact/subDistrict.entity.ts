import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sub_district')
export class SubDistrictEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string
}