import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { OfflineCourseEntity } from "./offlineCourse.entity"

@Entity("offline_course_statistic")
export class OfflineCourseStatisticEntity {
    @OneToOne(
        () => OfflineCourseEntity,
        (course) => course.statistic,
        { primary: true })
    @JoinColumn({ name: "course_id" })
    course: OfflineCourseEntity

    @Column({ name: "course_rank"})
    courseRank: number

    @Column()
    rating: number

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