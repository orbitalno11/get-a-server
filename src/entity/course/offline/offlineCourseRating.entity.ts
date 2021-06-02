import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { OfflineCourseEntity } from "./offlineCourse.entity"

// TODO Remove this class and use OfflineCourseStatistic
@Entity("course_rating")
export class OfflineCourseRatingEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    rating: number

    @Column({ name: "reviewNumber" })
    reviewNumber: number

    // entity relation
    @OneToOne(() => OfflineCourseEntity)
    @JoinColumn({ name: "course_id" })
    course: OfflineCourseEntity
}