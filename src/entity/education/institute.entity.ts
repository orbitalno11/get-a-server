import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EducationHistoryEntity } from './educationHistory.entity'

@Entity('institute')
export class InstituteEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  // entity relation
  @OneToMany(() => EducationHistoryEntity, (educationHistory) => educationHistory.institute)
  educationHistory: EducationHistoryEntity[]
}