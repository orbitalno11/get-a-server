import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { TutorEntity } from "../profile/tutor.entity"

@Entity("tutor_analytic_frequency_data")
export class TutorAnalyticFrequencyEntity {
    @OneToOne(
        () => TutorEntity,
        (tutor) => tutor.frequencyAnalytic,
        { primary: true })
    @JoinColumn({ name: "tutor_id" })
    tutor: TutorEntity

    @Column({ name: "number_of_login" })
    numberOfLogin: number

    @Column({ name: "number_of_course_view" })
    numberOfCourseView: number

    @Column({ name: "number_of_profile_view" })
    numberOfProfileView: number
}