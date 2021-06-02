import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { ClipEntity } from "./Clip.entity"
import { ClipRatingEntity } from "./ClipRating.entity"

@Entity("clip_statistic")
export class ClipStatisticEntity {
    @OneToOne(
        () => ClipEntity,
        (clip) => clip.statistic,
        { primary: true })
    @JoinColumn({ name: "clip_id" })
    clip: ClipEntity

    @Column({ name: "clip_rank"})
    clipRank: number

    @Column({ name: "number_of_view" })
    numberOfView: number

    // entity relation
    @OneToOne(
        () => ClipRatingEntity,
        (rating) => rating.statistic
    )
    @JoinColumn({ name: "clip_rating"})
    rating: ClipRatingEntity
}