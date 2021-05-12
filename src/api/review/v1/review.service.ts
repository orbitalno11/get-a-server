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
                    const updatedRating = this.calculateRatingAvg(courseRating.rating, courseRating.reviewNumber, data.rating)
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
     * Calculate rating average rating
     * @param oldRating
     * @param oldReviewNumber
     * @param newRating
     * @private
     */
    private calculateRatingAvg(oldRating: number, oldReviewNumber: number, newRating: number): number {
        return ((oldRating * oldReviewNumber) + newRating) / (oldReviewNumber + 1)
    }
}