import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OnlineCourseEntity } from "./OnlineCourse.entity"
import { OnlineCourseStatisticEntity } from "./OnlineCourseStatistic.entity"

@Entity("online_course_rating")
export class OnlineCourseRatingEntity {
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

    //entity relation
    @OneToOne(
        () => OnlineCourseEntity,
        (course) => course.rating
    )
    @JoinColumn({ name: "onlineCourseId" })
    onlineCourse: OnlineCourseEntity

    @OneToOne(
        () => OnlineCourseStatisticEntity,
        (statistic) => statistic.rating
    )
    statistic: OnlineCourseStatisticEntity
}