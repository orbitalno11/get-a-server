import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OnlineCourseEntity } from "../online/OnlineCourse.entity"
import { TutorEntity } from "../../profile/tutor.entity"
import { ClipRatingEntity } from "./ClipRating.entity"
import { ClipRatingTransactionEntity } from "./ClipRatingTransaction.entity"

@Entity("clip")
export class ClipEntity {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    url: string

    @Column()
    coverUrl: string

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

    @OneToMany(
        () => ClipRatingTransactionEntity,
        (rating) => rating.clip
    )
    clipReview: ClipRatingTransactionEntity[]
}