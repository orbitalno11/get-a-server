import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { TutorEntity } from "../profile/tutor.entity"

@Entity("tutor_statistic")
export class TutorStatisticEntity {
    @OneToOne(
        () => TutorEntity,
        (tutor) => tutor.statistic,
        { primary: true })
    @JoinColumn({ name: "tutor_id" })
    tutor: TutorEntity

    @Column({ name: "number_of_offline_course" })
    offlineCourseNumber: number

    @Column({ name: "number_of_online_course" })
    onlineCourseNumber: number

    @Column({ name: "number_of_learner" })
    numberOfLearner: number

    @Column({ name: "number_of_favorite" })
    numberOfFavorite: number

    @Column({ name: "offline_course_rank" })
    offlineCourseRank: number

    @Column({ name: "online_course_rank" })
    onlineCourseRank: number

    @Column({ name: "tutor_rating" })
    rating: number

    @Column({ name: "tutor_offline_rating" })
    offlineRating: number

    @Column({ name: "tutor_online_rating" })
    onlineRating: number
}