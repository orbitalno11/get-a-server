import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LearnerEntity } from '../../profile/learner.entity'
import { OfflineCourseEntity } from './offlineCourse.entity'

@Entity('course_rating_transaction')
export class OfflineCourseRatingTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  rating: number

  @Column()
  review: string

  @Column()
  reviewDate: Date

  // entity relation
  @ManyToOne(() => LearnerEntity, (learner) => learner.offlineCourseReview)
  @JoinColumn({ name: 'learnerId' })
  learner: LearnerEntity

  @ManyToOne(() => OfflineCourseEntity, (course) => course.courseReview)
  @JoinColumn({ name: 'courseId' })
  course: OfflineCourseEntity
}