import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OnlineCourseEntity } from "./OnlineCourse.entity"

@Entity("online_course_rating")
export class OnlineCourseRatingEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    reviewNumber: number

    @Column()
    rating: number

    //entity relation
    @OneToOne(
        () => OnlineCourseEntity,
        (course) => course.rating
    )
    @JoinColumn({ name: "onlineCourseId" })
    onlineCourse: OnlineCourseEntity
}