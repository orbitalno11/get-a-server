import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TutorEntity } from '../profile/tutor.entity'
import { ExamTypeEntity } from './examType.entity'

@Entity('testing_history')
export class TestingHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  testingScore: number

  // entity relation
  @ManyToOne(() => TutorEntity, (tutor) => tutor.testingHistory)
  @JoinColumn({ name: 'tutorId '})
  tutor: TutorEntity

  @ManyToOne(() => ExamTypeEntity, (exam) => exam.testingHistory)
  @JoinColumn({ name: 'examId '})
  exam: ExamTypeEntity
}