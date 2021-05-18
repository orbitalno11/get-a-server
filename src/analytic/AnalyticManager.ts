import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../repository/AnalyticRepository"
import { launch } from "../core/common/launch"
import RatingUtil from "../utils/rating/RatingUtil"
import { isNotEmpty } from "../core/extension/CommonExtension"

/**
 * Analytic manager
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class AnalyticManager {
    constructor(private readonly repository: AnalyticRepository) {
    }

    /**
     * Increase number of learner favorite
     * @param tutorId
     */
    increaseNumberOfFavorite(tutorId: string) {
        return launch(async () => {
            await this.repository.increaseStatisticNumberOfFavorite(tutorId)
            await this.repository.increaseMonetaryNumberOfFavorite(tutorId)
        })
    }

    /**
     * Decrease number of learner favorite
     * @param tutorId
     */
    decreaseNumberOfFavorite(tutorId: string) {
        return launch(async () => {
            await this.repository.decreaseStatisticNumberOfFavorite(tutorId)
            await this.repository.decreaseMonetaryNumberOfFavorite(tutorId)
        })
    }

    /**
     * Track tutor login
     * @param tutorId
     */
    trackLogin(tutorId: string) {
        return launch(async () => {
            await this.repository.trackLogin(tutorId)
        })
    }

    /**
     * Track tutor profile view
     * @param tutorId
     */
    trackProfileView(tutorId: string) {
        return launch(async () => {
            await this.repository.trackProfileView(tutorId)
        })
    }

    /**
     * Track tutor course view
     * @param tutorId
     */
    trackTutorCourseView(tutorId: string) {
        return launch(async () => {
            await this.repository.trackTutorCourseView(tutorId)
        })
    }

    /**
     * Track tutor approve learner to course
     * @param tutorId
     */
    trackTutorApproved(tutorId: string) {
        return launch(async () => {
            await this.repository.trackTutorApproved(tutorId)
        })
    }

    /**
     * Track tutor create offline course
     * @param tutorId
     */
    trackTutorCreateOfflineCourse(tutorId: string) {
        return launch(async () => {
            await this.repository.trackTutorCreateOfflineCourse(tutorId)
        })
    }

    trackLearnerReviewOfflineCourse(tutorId: string, rating: number, firstTime: boolean = true, oldRating: number = 0) {
        return launch(async () => {
            const statistic = await this.repository.getTutorStatistic(tutorId)
            const monetary = await this.repository.getTutorMonetary(tutorId)

            if (isNotEmpty(statistic) && isNotEmpty(monetary)) {
                const deleteReview = rating === 0.0
                let updateStatisticRating: number
                let updatedStatisticReviewNumber: number
                let updateMonetaryRating: number
                let updatedMonetaryReviewNumber: number

                if (firstTime) {
                    updateStatisticRating = RatingUtil.calculateIncreaseRatingAvg(
                        statistic.offlineRating,
                        rating,
                        statistic.numberOfOfflineReview
                    )
                    updatedStatisticReviewNumber = statistic.numberOfOfflineReview + 1
                    updateMonetaryRating = RatingUtil.calculateIncreaseRatingAvg(
                        monetary.offlineRating,
                        rating,
                        monetary.numberOfOfflineReview
                    )
                    updatedMonetaryReviewNumber = monetary.numberOfOfflineReview + 1
                } else {
                    updateStatisticRating = RatingUtil.calculateUpdateRatingAvg(
                        statistic.offlineRating,
                        rating,
                        oldRating,
                        statistic.numberOfOfflineReview
                    )
                    updatedStatisticReviewNumber = !deleteReview ? statistic.numberOfOfflineReview : statistic.numberOfOfflineReview - 1
                    updateMonetaryRating = RatingUtil.calculateUpdateRatingAvg(
                        monetary.offlineRating,
                        rating,
                        oldRating,
                        monetary.numberOfOfflineReview
                    )
                    updatedMonetaryReviewNumber = !deleteReview ? monetary.numberOfOfflineReview : monetary.numberOfOfflineReview - 1
                }

                if (updateStatisticRating?.isSafeNumber() &&
                    updatedStatisticReviewNumber?.isSafeNumber() &&
                    updateMonetaryRating?.isSafeNumber() &&
                    updatedMonetaryReviewNumber?.isSafeNumber()
                ) {
                    await this.repository.trackLearnerReviewOfflineCourse(
                        tutorId,
                        updateStatisticRating,
                        updatedStatisticReviewNumber,
                        updateMonetaryRating,
                        updatedMonetaryReviewNumber,
                        deleteReview
                    )
                }
            }
        })
    }
}

export default AnalyticManager