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

    @Column()
    rating: number

    @Column({ name: "clip_rank"})
    clipRank: number

    @Column({ name: "number_of_view" })
    numberOfView: number

    @Column({ name: "number_of_review" })
    numberOfReview: number

    @Column({ name: "number_of_one_star" })
    oneStar: number

    @Column({ name: "number_of_two_star" })
    twoStar: number

    @Column({ name: "number_of_three_star" })
    threeStar: number

    @Column({ name: "number_of_four_star" })
    fourStar: number

    @Column({ name: "number_of_five_star" })
    fiveStar: number
}