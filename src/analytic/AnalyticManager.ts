import { Injectable } from "@nestjs/common"
import { PythonShell } from "python-shell"
import AnalyticRepository from "../repository/AnalyticRepository"
import { launch, launchAnalytic } from "../core/common/launch"
import RatingUtil from "../utils/rating/RatingUtil"
import { isEmpty } from "../core/extension/CommonExtension"
import { CourseType } from "../model/course/data/CourseType"
import * as config from "../configs/EnvironmentConfig"

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
        launchAnalytic(async () => {
            await this.repository.increaseNumberOfFavorite(tutorId)
        })
    }

    /**
     * Decrease number of learner favorite
     * @param tutorId
     */
    decreaseNumberOfFavorite(tutorId: string) {
        launchAnalytic(async () => {
            await this.repository.decreaseNumberOfFavorite(tutorId)
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
    trackImpressProfile(tutorId: string) {
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
     * Track impress clip
     * @param clipId
     */
    trackImpressClip(clipId: string) {
        return launch(async () => {
            await this.repository.trackImpressClip(clipId)
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
     * Track tutor create online course
     * @param tutorId
     */
    trackCreateOnlineCourse(tutorId: string) {
        return launch(async () => {
            await this.repository.trackCreateOnlineCourse(tutorId)
        })
    }

    /**
     * Track learner review
     * @param tutorId
     * @param rating
     * @param offline
     * @param firstTime
     * @param oldRating
     */
    trackLearnerReview(tutorId: string, rating: number, offline: boolean, firstTime: boolean = true, oldRating: number = 0) {
        return launch(async () => {
            const statistic = await this.repository.getTutorStatistic(tutorId)
            const monetary = await this.repository.getTutorMonetary(tutorId)

            if (isEmpty(statistic) || isEmpty(monetary)) {
                return
            }

            const deleteReview = rating === 0.0

            const ratingKey = offline ? "offlineRating" : "onlineRating"
            const reviewNumberKey = offline ? "numberOfOfflineReview" : "numberOfOnlineReview"

            if (firstTime) {
                statistic[ratingKey] = RatingUtil.calculateIncreaseRatingAvg(
                    statistic[ratingKey],
                    rating,
                    statistic[reviewNumberKey]
                )
                statistic[reviewNumberKey] += 1

                monetary[ratingKey] = RatingUtil.calculateIncreaseRatingAvg(
                    monetary[ratingKey],
                    rating,
                    monetary[reviewNumberKey]
                )
                monetary[reviewNumberKey] += 1
            } else {
                statistic[ratingKey] = RatingUtil.calculateUpdateRatingAvg(
                    statistic[ratingKey],
                    rating,
                    oldRating,
                    statistic[reviewNumberKey]
                )
                statistic[reviewNumberKey] = !deleteReview ? statistic[reviewNumberKey] : statistic[reviewNumberKey] - 1

                monetary[ratingKey] = RatingUtil.calculateUpdateRatingAvg(
                    monetary[ratingKey],
                    rating,
                    oldRating,
                    monetary[reviewNumberKey]
                )
                if (deleteReview) {
                    monetary[reviewNumberKey] = monetary[reviewNumberKey] > 0 ? monetary[reviewNumberKey] - 1 : 0
                } else {
                    monetary[reviewNumberKey] = monetary[reviewNumberKey] > 0 ? monetary[reviewNumberKey] : 1
                }
            }

            statistic.rating = RatingUtil.calculateTutorRatingAvg(
                statistic.offlineRating,
                statistic.onlineRating,
                statistic.numberOfOfflineReview,
                statistic.numberOfOnlineReview
            )

            monetary.rating = RatingUtil.calculateTutorRatingAvg(
                monetary.offlineRating,
                monetary.onlineRating,
                monetary.numberOfOfflineReview,
                monetary.numberOfOnlineReview
            )

            await this.repository.trackLearnerReview(tutorId, statistic, monetary, deleteReview)
        })
    }

    /**
     * Update online course rank
     */
    updateOnlineCourseRank() {
        const host = config.DATABASE_HOST
        const name = config.DATABASE_NAME
        const user = config.DATABASE_USER
        const password = config.DATABASE_PASSWORD
        const port = config.DATABASE_PORT.toString()

        const option = {
            args: [host, name, user, password, port]
        }

        return new Promise<void>((resolve, reject) => {
            PythonShell.run("./ranking/start_wilson_lower_bound.py", option, (err, output) => {
                if (err) {
                    reject()
                }
                if (output[0] === "success") {
                    resolve()
                } else {
                    reject()
                }
            })
        })
    }

    /**
     * Update tutor rank
     */
    updateTutorRank() {
        const host = config.DATABASE_HOST
        const name = config.DATABASE_NAME
        const user = config.DATABASE_USER
        const password = config.DATABASE_PASSWORD
        const port = config.DATABASE_PORT.toString()

        const option = {
            args: [host, name, user, password, port]
        }

        return new Promise<void>((resolve, reject) => {
            PythonShell.run("./ranking/start_rfm.py", option, (err, output) => {
                if (err) {
                    reject()
                }
                if (output[0] === "success") {
                    resolve()
                } else {
                    reject()
                }
            })
        })
    }

    /**
     * Clear tutor statistic data
     */
    clearAnalyticData() {
        return launch(async () => {
            await this.repository.clearAnalyticData()
        })
    }
}

export default AnalyticManager