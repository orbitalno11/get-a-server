import { Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LearnerEntity } from '../../profile/learner.entity'
import { OfflineCourseEntity } from './offlineCourse.entity'

@Entity('course_learner_request')
export class OfflineCourseLeanerRequestEntity {
  @PrimaryGeneratedColumn()
  id: number

  // entity relation
  @ManyToOne(() => LearnerEntity, (learner) => learner.requestCourse)
  @JoinColumn({ name: 'leanerId' })
  leaner: LearnerEntity

  @ManyToOne(() => OfflineCourseEntity, (course) => course.requestList)
  @JoinTable({ name: 'courseId' })
  course: OfflineCourseEntity
}