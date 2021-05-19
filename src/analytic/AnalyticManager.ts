import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../repository/AnalyticRepository"
import { launch } from "../core/common/launch"
import RatingUtil from "../utils/rating/RatingUtil"
import { isNotEmpty } from "../core/extension/CommonExtension"
import { CourseType } from "../model/course/data/CourseType"

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
     * @param courseId
     * @param courseType
     */
    trackImpressCourse(courseId: string, courseType: CourseType) {
        return launch(async () => {
            await this.repository.trackImpressCourse(courseId, courseType)
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

    /**
     * Track learner review offline course
     * @param tutorId
     * @param rating
     * @param firstTime
     * @param oldRating
     */
    trackLearnerReviewOfflineCourse(tutorId: string, rating: number, firstTime: boolean = true, oldRating: number = 0) {
        return launch(async () => {
            const statistic = await this.repository.getTutorStatistic(tutorId)
            const monetary = await this.repository.getTutorMonetary(tutorId)

            if (isNotEmpty(statistic) && isNotEmpty(monetary)) {
                const deleteReview = rating === 0.0
                let updateStatisticTutorRating: number
                let updateStatisticRating: number
                let updateStatisticReviewNumber: number
                let updateMonetaryTutorRating: number
                let updateMonetaryRating: number
                let updateMonetaryReviewNumber: number

                if (firstTime) {
                    updateStatisticRating = RatingUtil.calculateIncreaseRatingAvg(
                        statistic.offlineRating,
                        rating,
                        statistic.numberOfOfflineReview
                    )
                    updateStatisticReviewNumber = statistic.numberOfOfflineReview + 1

                    updateMonetaryRating = RatingUtil.calculateIncreaseRatingAvg(
                        monetary.offlineRating,
                        rating,
                        monetary.numberOfOfflineReview
                    )
                    updateMonetaryReviewNumber = monetary.numberOfOfflineReview + 1
                } else {
                    updateStatisticRating = RatingUtil.calculateUpdateRatingAvg(
                        statistic.offlineRating,
                        rating,
                        oldRating,
                        statistic.numberOfOfflineReview
                    )
                    updateStatisticReviewNumber = !deleteReview ? statistic.numberOfOfflineReview : statistic.numberOfOfflineReview - 1

                    updateMonetaryRating = RatingUtil.calculateUpdateRatingAvg(
                        monetary.offlineRating,
                        rating,
                        oldRating,
                        monetary.numberOfOfflineReview
                    )
                    updateMonetaryReviewNumber = !deleteReview ? monetary.numberOfOfflineReview : monetary.numberOfOfflineReview - 1
                }

                updateStatisticTutorRating = RatingUtil.calculateTutorRatingAvg(
                    updateStatisticRating,
                    statistic.onlineRating,
                    updateStatisticReviewNumber,
                    statistic.numberOfOnlineReview
                )

                updateMonetaryTutorRating = RatingUtil.calculateTutorRatingAvg(
                    updateMonetaryRating,
                    monetary.onlineRating,
                    updateMonetaryReviewNumber,
                    monetary.numberOfOnlineReview
                )

                if (updateStatisticTutorRating?.isSafeNumber() &&
                    updateStatisticRating?.isSafeNumber() &&
                    updateStatisticReviewNumber?.isSafeNumber() &&
                    updateMonetaryTutorRating?.isSafeNumber() &&
                    updateMonetaryRating?.isSafeNumber() &&
                    updateMonetaryReviewNumber?.isSafeNumber()
                ) {
                    await this.repository.trackLearnerReviewOfflineCourse(
                        tutorId,
                        updateStatisticTutorRating,
                        updateStatisticRating,
                        updateStatisticReviewNumber,
                        updateMonetaryTutorRating,
                        updateMonetaryRating,
                        updateMonetaryReviewNumber,
                        deleteReview
                    )
                }
            }
        })
    }
}

export default AnalyticManager