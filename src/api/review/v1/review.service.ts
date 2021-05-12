import { Injectable } from "@nestjs/common"
import ReviewRepository from "../../../repository/ReviewRepository"
import ReviewForm from "../../../model/review/ReviewForm"
import User from "../../../model/User"
import { launch } from "../../../core/common/launch"
import UserUtil from "../../../utils/UserUtil"
import { isEmpty } from "../../../core/extension/CommonExtension"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"

/**
 * Class for review service
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class ReviewService {
    constructor(
        private readonly repository: ReviewRepository,
        private readonly userUtil: UserUtil
    ) {
    }

    /**
     * Create course review
     * @param data
     * @param user
     */
    createReview(data: ReviewForm, user: User) {
        return launch(async () => {
            const learner = await this.userUtil.getLearner(user.id)
            const enrolledCourse = await this.userUtil.getEnrolled(user.id, data.id, data.isOfflineCourse)
            if (!isEmpty(enrolledCourse)) {
                if (data.isOfflineCourse) {
                    const courseRating = await this.repository.getOfflineCourseRating(data.id)
                    const updatedRating = this.calculateAddRatingAvg(courseRating.rating, data.rating, courseRating.reviewNumber)
                    const updatedReviewNumber = courseRating.reviewNumber + 1
                    await this.repository.createOfflineCourseReview(data, learner, enrolledCourse, updatedRating, updatedReviewNumber)
                } else {
                    // todo online course
                    return null
                }
            } else {
                throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
            }
        })
    }

    /**
     * Update course review
     * @param data
     * @param user
     */
    updateReview(data: ReviewForm, user: User) {
        return launch(async () => {
            const learner = await this.userUtil.getLearner(user.id)
            const enrolledCourse = await this.userUtil.getEnrolled(user.id, data.id, data.isOfflineCourse)
            if (!isEmpty(enrolledCourse)) {
                if (data.isOfflineCourse) {
                    const userRating = await this.repository.getOfflineCourseRatingByUser(data.id, learner.id)
                    const courseRating = await this.repository.getOfflineCourseRating(data.id)

                    const decreaseRating = this.calculateRemoveRatingAvg(courseRating.rating, userRating.rating, courseRating.reviewNumber)
                    const decreaseReviewNumber = courseRating.reviewNumber - 1

                    const updatedRating = this.calculateAddRatingAvg(decreaseRating, data.rating, decreaseReviewNumber)

                    await this.repository.updateOfflineCourseReview(data, learner, enrolledCourse, updatedRating, courseRating.reviewNumber)
                } else {
                    // todo online course
                    return null
                }
            } else {
                throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
            }
        })
    }

    /**
     * Delete course review
     * @param courseId
     * @param isOfflineCourse
     * @param user
     */
    deleteReview(courseId: string, isOfflineCourse: boolean, user: User) {
        return launch(async () => {
            const learner = await this.userUtil.getLearner(user.id)
            const enrolledCourse = await this.userUtil.getEnrolled(user.id, courseId, isOfflineCourse)
            if (!isEmpty(enrolledCourse)) {
                if (isOfflineCourse) {
                    const userRating = await this.repository.getOfflineCourseRatingByUser(courseId, learner.id)
                    const courseRating = await this.repository.getOfflineCourseRating(courseId)

                    const decreaseRating = this.calculateRemoveRatingAvg(courseRating.rating, userRating.rating, courseRating.reviewNumber)
                    const decreaseReviewNumber = courseRating.reviewNumber - 1

                    await this.repository.deleteOfflineReview(enrolledCourse, userRating, decreaseRating, decreaseReviewNumber)
                } else {
                    // todo online course
                    return null
                }
            } else {
                throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
            }
        })
    }

    /**
     * Calculate rating average rating
     * @param avgRating
     * @param reviewNumber
     * @param addRating
     * @private
     */
    private calculateAddRatingAvg(avgRating: number, addRating: number, reviewNumber: number): number {
        return ((avgRating * reviewNumber) + addRating) / (reviewNumber + 1)
    }

    private calculateRemoveRatingAvg(avgRating: number, removeRating: number, reviewNumber: number): number {
        const number = reviewNumber > 1 ? (reviewNumber - 1) : 1
        return ((avgRating * reviewNumber) - removeRating) / (number)
    }
}