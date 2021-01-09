import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EducationHistoryEntity } from './educationHistory.entity'

@Entity('branch')
export class BranchEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string

  // entity relation
  @OneToMany(() => EducationHistoryEntity, (educationHistory) => educationHistory.branch)
  educationHistory: EducationHistoryEntity[]
}