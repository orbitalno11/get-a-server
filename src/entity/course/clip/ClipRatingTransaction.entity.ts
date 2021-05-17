import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { LearnerEntity } from "../../profile/learner.entity"
import { ClipEntity } from "./Clip.entity"

@Entity("online_clip_rating_transaction")
export class ClipRatingTransactionEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    rating: number

    @Column()
    review: string

    @Column()
    reviewDate: Date = new Date()

    // entity relation
    @ManyToOne(
        () => LearnerEntity,
        (learner) => learner.onlineClipReview
    )
    @JoinColumn({ name: "learnerId" })
    learner: LearnerEntity

    @ManyToOne(
        () => ClipEntity,
        (clip) => clip.clipReview
    )
    @JoinColumn({ name: "clipId" })
    clip: ClipEntity
}