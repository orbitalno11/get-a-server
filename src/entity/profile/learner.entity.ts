import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { GradeEntity } from "../common/grade.entity"
import { ContactEntity } from "../contact/contact.entitiy"
import { OfflineCourseLeanerRequestEntity } from "../course/offline/offlineCourseLearnerRequest.entity"
import { OfflineCourseRatingTransactionEntity } from "../course/offline/offlineCourseRatingTransaction.entity"
import { FavoriteTutorEntity } from "../favoriteTutor.entity"
import { MemberEntity } from "../member/member.entitiy"

@Entity("learner_profile")
export class LearnerEntity {
  @PrimaryGeneratedColumn()
  id: string

  // entity relation
  @OneToOne(() => MemberEntity)
  @JoinColumn()
  member: MemberEntity

  @OneToOne(() => ContactEntity)
  @JoinColumn()
  contact: ContactEntity

  @OneToOne(() => GradeEntity)
  @JoinColumn({ "name": "gradeId" })
  grade: GradeEntity

  @OneToMany(() => FavoriteTutorEntity, (favorite) => favorite.learner)
  favoriteTutor: FavoriteTutorEntity[]

  @OneToMany(() => OfflineCourseRatingTransactionEntity, (rating) => rating.learner)
  offlineCourseReview: OfflineCourseRatingTransactionEntity[]

  @OneToMany(() => OfflineCourseLeanerRequestEntity, (request) => request.leaner)
  requestCourse: OfflineCourseLeanerRequestEntity[]
}