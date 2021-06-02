import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OfflineCourseEntity } from "./offlineCourse.entity"
import { OfflineCourseStatisticEntity } from "./OfflineCourseStatistic.entity"

@Entity("offline_course_rating")
export class OfflineCourseRatingEntity {
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
    @OneToOne(() => OfflineCourseEntity)
    @JoinColumn({ name: "course_id" })
    course: OfflineCourseEntity

    @OneToOne(
        () => OfflineCourseStatisticEntity,
        (statistic) => statistic.rating
    )
    statistic: OfflineCourseStatisticEntity
}