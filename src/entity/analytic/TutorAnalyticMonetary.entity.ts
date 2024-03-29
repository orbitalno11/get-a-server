import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { TutorEntity } from "../profile/tutor.entity"

@Entity("tutor_analytic_monetary_data")
export class TutorAnalyticMonetaryEntity {
    @OneToOne(
        () => TutorEntity,
        (tutor) => tutor.monetaryAnalytic,
        { primary: true })
    @JoinColumn({ name: "tutor_id" })
    tutor: TutorEntity

    @Column({ name: "tutor_rating" })
    rating: number

    @Column({ name: "tutor_offline_rating" })
    offlineRating: number

    @Column({ name: "tutor_online_rating" })
    onlineRating: number

    @Column({ name: "number_of_learner" })
    numberOfLearner: number

    @Column({ name: "number_of_favorite" })
    numberOfFavorite: number

    @Column({ name: "number_of_offline_review"})
    numberOfOfflineReview: number

    @Column({ name: "number_of_online_review"})
    numberOfOnlineReview: number
}