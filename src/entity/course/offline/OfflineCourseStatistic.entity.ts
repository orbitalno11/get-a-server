import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { OfflineCourseEntity } from "./offlineCourse.entity"
import { OfflineCourseRatingEntity } from "./offlineCourseRating.entity"

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

    @Column({ name: "number_of_view" })
    numberOfView: number

    // entity relation
    @OneToOne(
        () => OfflineCourseRatingEntity,
        (rating) => rating.statistic
    )
    @JoinColumn({ name: "course_rating"})
    rating: OfflineCourseEntity
}