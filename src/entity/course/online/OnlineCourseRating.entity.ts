import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OnlineCourseEntity } from "./OnlineCourse.entity"
import { OnlineCourseStatisticEntity } from "./OnlineCourseStatistic.entity"

// TODO Remove this class and use OnlineCourseStatistic
@Entity("online_course_rating")
export class OnlineCourseRatingEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    rating: number

    @Column({ name: "reviewNumber" })
    reviewNumber: number
}