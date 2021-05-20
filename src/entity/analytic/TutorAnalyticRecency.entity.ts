import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { TutorEntity } from "../profile/tutor.entity"

@Entity("tutor_analytic_recency_data")
export class TutorAnalyticRecencyEntity {
    @OneToOne(
        () => TutorEntity,
        (tutor) => tutor.recencyAnalytic,
        { primary: true })
    @JoinColumn({ name: "tutor_id" })
    tutor: TutorEntity

    @Column({ name: "recent_login" })
    recentLogin: Date

    @Column({ name: "recent_profile_view" })
    recentProfileView: Date

    @Column({ name: "recent_comment" })
    recentComment: Date

    @Column({ name: "recent_approved" })
    recentApproved: Date
}