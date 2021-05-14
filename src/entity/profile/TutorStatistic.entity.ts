import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { TutorEntity } from "./tutor.entity"

@Entity("tutor_statistic")
export class TutorStatisticEntity {
    @OneToOne(
        () => TutorEntity,
        (tutor) => tutor.statistic,
        { primary: true })
    @JoinColumn({ name: "tutor_id" })
    tutor: TutorEntity

    @Column({ name: "number_of_offline_course" })
    offlineCourseNumber: number = 0

    @Column({ name: "number_of_online_course" })
    onlineCourseNumber: number = 0

    @Column({ name: "number_of_learner" })
    numberOfLearner: number = 0

    @Column({ name: "offline_course_rank" })
    offlineCourseRank: number = 0

    @Column({ name: "tutor_rating" })
    rating: number = 0
}