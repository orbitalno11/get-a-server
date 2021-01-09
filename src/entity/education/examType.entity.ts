import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TestingHistoryEntity } from './testingHistory.entity'

@Entity('exam_type')
export class ExamTypeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  // entity relation
  @OneToMany(() => TestingHistoryEntity, (testingHistory) => testingHistory.exam)
  testingHistory: TestingHistoryEntity[]
}