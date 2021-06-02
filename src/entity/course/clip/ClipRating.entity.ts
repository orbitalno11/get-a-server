import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ClipEntity } from "./Clip.entity"
import { ClipStatisticEntity } from "./ClipStatistic.entity"

@Entity("clip_rating")
export class ClipRatingEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    rating: number

    @Column({ name: "number_of_review" })
    reviewNumber: number

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

    // entity relation
    @OneToOne(
        () => ClipEntity,
        (clip) => clip.rating
    )
    @JoinColumn({ name: "clip_id" })
    clip: ClipEntity

    @OneToOne(
        () => ClipStatisticEntity,
        (statistic) => statistic.rating
    )
    statistic: ClipStatisticEntity
}