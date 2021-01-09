import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm"
import { GradeEntity } from "../../common/grade.entity"
import { SubjectEntity } from "../../common/subject.entity"
import { TutorEntity } from "../../profile/tutor.entity"
import { CourseTypeEntity } from "../courseType.entity"
import { OfflineCourseLeanerRequestEntity } from "./offlineCourseLearnerRequest.entity"
import { OfflineCourseRatingEntity } from "./offlineCourseRating.entity"
import { OfflineCourseRatingTransactionEntity } from "./offlineCourseRatingTransaction.entity"

@Entity("course")
export class OfflineCourseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  cost: number

  @Column()
  day: number

  @Column()
  startTime: string

  @Column()
  endTime: string

  @Column()
  status: string

  @Column()
  requestNumber: number

  // entity relation attribute
  @ManyToOne(() => TutorEntity, (tutor) => tutor.offlineCourse)
  @JoinColumn({ name: "ownerId" })
  owner: TutorEntity

  @ManyToOne(() => CourseTypeEntity, (type) => type.offlineCourse)
  @JoinColumn({ name: "courseTypeId" })
  courseType: CourseTypeEntity

  @ManyToOne(() => SubjectEntity, (subject) => subject.offlineCourse)
  @JoinColumn({ name: "subjectCode" })
  subject: SubjectEntity

  @ManyToOne(() => GradeEntity, (grade) => grade.offlineCourse)
  @JoinColumn({ name: "gradeId" })
  grade: GradeEntity

  // entity relation
  @OneToOne(() => OfflineCourseRatingEntity, (rating) => rating.course)
  rating: OfflineCourseRatingEntity

  @OneToMany(() => OfflineCourseRatingTransactionEntity, (rating) => rating.course)
  courseReview: OfflineCourseRatingTransactionEntity[]

  @OneToMany(() => OfflineCourseLeanerRequestEntity, (request) => request.course)
  requestList: OfflineCourseLeanerRequestEntity[]
}