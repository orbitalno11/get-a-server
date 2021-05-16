import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('district')
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string
}