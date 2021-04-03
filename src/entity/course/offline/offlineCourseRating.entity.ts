import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { OfflineCourseEntity } from './offlineCourse.entity'

@Entity('course_rating')
export class OfflineCourseRatingEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  reviewNumber: number

  @Column()
  rating: number

  // entity relation
  @OneToOne(() => OfflineCourseEntity)
  @JoinColumn({ name: 'courseId' })
  course: OfflineCourseEntity
}