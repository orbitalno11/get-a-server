import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {GradeEntity} from "../common/grade.entity"
import {ContactEntity} from "../contact/contact.entitiy"
import {OfflineCourseLeanerRequestEntity} from "../course/offline/offlineCourseLearnerRequest.entity"
import {OfflineCourseRatingTransactionEntity} from "../course/offline/offlineCourseRatingTransaction.entity"
import {FavoriteTutorEntity} from "../favoriteTutor.entity"
import {MemberEntity} from "../member/member.entitiy"
import { ClipRatingTransactionEntity } from "../course/clip/ClipRatingTransaction.entity"
import { ClipTransactionEntity } from "../course/clip/ClipTransaction.entity"

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
    @JoinColumn({"name": "gradeId"})
    grade: GradeEntity

    @OneToMany(() => FavoriteTutorEntity, (favorite) => favorite.learner)
    favoriteTutor: FavoriteTutorEntity[]

    @OneToMany(() => OfflineCourseRatingTransactionEntity, (rating) => rating.learner)
    offlineCourseReview: OfflineCourseRatingTransactionEntity[]

    @OneToMany(() => ClipRatingTransactionEntity, (rating) => rating.learner)
    onlineClipReview: ClipRatingTransactionEntity[]

    @OneToMany(() => OfflineCourseLeanerRequestEntity, (request) => request.learner)
    requestCourse: OfflineCourseLeanerRequestEntity[]

    @OneToMany(() => ClipTransactionEntity, (clip) => clip.learner)
    onlineClips: ClipTransactionEntity
}