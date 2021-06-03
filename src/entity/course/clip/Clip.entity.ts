import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OnlineCourseEntity } from "../online/OnlineCourse.entity"
import { TutorEntity } from "../../profile/tutor.entity"
import { ClipRatingEntity } from "./ClipRating.entity"
import { ClipRatingTransactionEntity } from "./ClipRatingTransaction.entity"
import { ClipTransactionEntity } from "./ClipTransaction.entity"
import { ClipStatisticEntity } from "./ClipStatistic.entity"

@Entity("clip")
export class ClipEntity {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    cost: number

    @Column()
    url: string

    @Column()
    urlCloudPath: string

    @Column()
    coverUrl: string

    @Column()
    coverUrlCloudPath: string

    // entity relation
    @ManyToOne(
        () => OnlineCourseEntity,
        (course) => course.clips
    )
    @JoinColumn({ name: "onlineCourseId" })
    onlineCourse: OnlineCourseEntity

    @ManyToOne(
        () => TutorEntity,
        (tutor) => tutor.onlineClips
    )
    @JoinColumn({ name: "ownerId" })
    owner: TutorEntity

    @OneToOne(
        () => ClipRatingEntity,
        (rating) => rating.clip
    )
    rating: ClipRatingEntity

    @OneToOne(
        () => ClipStatisticEntity,
        (statistic) => statistic.clip,
        { cascade: ["insert"] }
    )
    statistic: ClipStatisticEntity

    @OneToMany(
        () => ClipRatingTransactionEntity,
        (rating) => rating.clip
    )
    clipReview: ClipRatingTransactionEntity[]

    @OneToMany(
        () => ClipTransactionEntity,
        (transaction) => transaction.clip
    )
    transaction: ClipTransactionEntity[]
}