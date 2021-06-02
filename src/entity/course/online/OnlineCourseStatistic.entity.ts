import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { OnlineCourseEntity } from "./OnlineCourse.entity"
import { OnlineCourseRatingEntity } from "./OnlineCourseRating.entity"

@Entity("online_course_statistic")
export class OnlineCourseStatisticEntity {
    @OneToOne(
        () => OnlineCourseEntity,
        (course) => course.statistic,
        { primary: true })
    @JoinColumn({ name: "course_id" })
    onlineCourse: OnlineCourseEntity

    @Column({ name: "course_rank"})
    courseRank: number

    @Column({ name: "number_of_clip" })
    numberOfClip: number

    @Column({ name: "number_of_clip_view" })
    numberOfClipView: number

    // entity relation
    @OneToOne(
        () => OnlineCourseRatingEntity,
        (rating) => rating.statistic
    )
    @JoinColumn({ name: "course_rating"})
    rating: OnlineCourseRatingEntity
}