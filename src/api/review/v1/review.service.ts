import { Injectable } from "@nestjs/common"
import ReviewRepository from "../../../repository/ReviewRepository"
import ReviewForm from "../../../model/review/ReviewForm"
import User from "../../../model/User"
import { launch } from "../../../core/common/launch"
import UserUtil from "../../../utils/UserUtil"
import { isEmpty, isNotEmpty } from "../../../core/extension/CommonExtension"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"
import { CourseType } from "../../../model/course/data/CourseType"
import { UserRole } from "../../../core/constant/UserRole"
import LearnerProfile from "../../../model/profile/LearnerProfile"
import { OfflineCourseReviewToReviewMapper } from "../../../utils/mapper/course/offline/OfflineCourseReviewToReviewMapper"
import Review from "../../../model/review/Review"
import RatingUtil from "../../../utils/rating/RatingUtil"
import AnalyticManager from "../../../analytic/AnalyticManager"
import { ReviewError } from "../../../core/exceptions/constants/review-error.enum"
import { OfflineCourseEntity } from "../../../entity/course/offline/offlineCourse.entity"

/**
 * Class for review service
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class ReviewService {
    constructor(
        private readonly repository: ReviewRepository,
        private readonly userUtil: UserUtil,
        private readonly analytic: AnalyticManager
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
            const isOfflineCourse = this.isOfflineCourse(data.courseType)
            const isReviewed = await this.userUtil.isReviewCourse(user.id, data.courseId)
            if (!isReviewed) {
                const enrolledCourse = await this.userUtil.getEnrolled(user.id, data.courseId, isOfflineCourse)
                if (!isEmpty(enrolledCourse)) {
                    if (isOfflineCourse && enrolledCourse instanceof OfflineCourseEntity) {
                        const courseRating = await this.repository.getOfflineCourseRating(data.courseId)
                        const updatedRating = RatingUtil.calculateIncreaseRatingAvg(courseRating.rating, data.rating, courseRating.reviewNumber)
                        const updatedReviewNumber = courseRating.reviewNumber + 1
                        await this.repository.createOfflineCourseReview(data, learner, enrolledCourse, updatedRating, updatedReviewNumber)
                        await this.analytic.trackLearnerReviewOfflineCourse(enrolledCourse.owner?.id, data.rating)
                    } else {
                        // todo online course
                        return null
                    }
                } else {
                    throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
                }
            } else {
                throw ErrorExceptions.create("Your already review this course", ReviewError.ALREADY_REVIEW)
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
            const isOfflineCourse = this.isOfflineCourse(data.courseType)
            const enrolledCourse = await this.userUtil.getEnrolled(user.id, data.courseId, isOfflineCourse)
            if (isNotEmpty(enrolledCourse)) {
                if (isOfflineCourse && enrolledCourse instanceof OfflineCourseEntity) {
                    const userRating = await this.repository.getOfflineCourseRatingByUser(data.reviewId)
                    if (isNotEmpty(userRating)) {
                        const courseRating = await this.repository.getOfflineCourseRating(data.courseId)

                        const updatedRating = RatingUtil.calculateUpdateRatingAvg(
                            courseRating.rating,
                            data.rating,
                            userRating.rating,
                            courseRating.reviewNumber
                        )

                        await this.repository.updateOfflineCourseReview(data, enrolledCourse, updatedRating, courseRating.reviewNumber)
                        await this.analytic.trackLearnerReviewOfflineCourse(enrolledCourse.owner?.id, data.rating, false, userRating.rating)
                    } else {
                        // todo online course
                        return null
                    }
                } else {
                    throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
                }
            }
        })
    }

    /**
     * Delete course review
     * @param reviewId
     * @param courseId
     * @param courseType
     * @param user
     */
    deleteReview(reviewId: number, courseId: string, courseType: CourseType, user: User) {
        return launch(async () => {
            const isOfflineCourse = this.isOfflineCourse(courseType)
            const enrolledCourse = await this.userUtil.getEnrolled(user.id, courseId, isOfflineCourse)
            if (isNotEmpty(enrolledCourse)) {
                if (isOfflineCourse && enrolledCourse instanceof OfflineCourseEntity) {
                    const userRating = await this.repository.getOfflineCourseRatingByUser(reviewId)
                    if (isNotEmpty(userRating)) {
                        const courseRating = await this.repository.getOfflineCourseRating(courseId)

                        const decreaseRating = RatingUtil.calculateDecreaseRatingAvg(courseRating.rating, userRating.rating, courseRating.reviewNumber)
                        const decreaseReviewNumber = courseRating.reviewNumber - 1

                        await this.repository.deleteOfflineReview(enrolledCourse, userRating, decreaseRating, decreaseReviewNumber)
                        await this.analytic.trackLearnerReviewOfflineCourse(enrolledCourse.owner?.id, 0.0, false, userRating.rating)
                    } else {
                        // todo online course
                        return null
                    }
                } else {
                    throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
                }
            }
        })
    }

    /**
     * Get course review by course id
     * @param courseId
     * @param courseType
     * @param user
     */
    getCourseReview(courseId: string, courseType: CourseType, user?: User): Promise<Review[]> {
        return launch(async () => {
            if (this.isOfflineCourse(courseType)) {
                if (user && user.role === UserRole.LEARNER) {
                    const isEnrolled = await this.userUtil.isEnrolled(user.id, courseId)
                    if (isEnrolled) {
                        const learnerId = LearnerProfile.getLearnerId(user.id)
                        const userReview = await this.repository.getOfflineCourseReviewByUser(courseId, learnerId)
                        const allReview = await this.repository.getOfflineCourseReview(courseId, learnerId)
                        const reviews = new OfflineCourseReviewToReviewMapper().toReviewArray(allReview)
                        if (!isEmpty(userReview)) {
                            const review = new OfflineCourseReviewToReviewMapper(true).map(userReview)
                            reviews.push(review)
                        }
                        return reviews
                    } else {
                        const allReview = await this.repository.getOfflineCourseReview(courseId)
                        return new OfflineCourseReviewToReviewMapper().toReviewArray(allReview)
                    }
                } else {
                    const allReview = await this.repository.getOfflineCourseReview(courseId)
                    return new OfflineCourseReviewToReviewMapper().toReviewArray(allReview)
                }
            } else {
                // todo online course
                return null
            }
        })
    }

    /**
     * Get course review by review id
     * @param reviewId
     * @param courseType
     */
    getCourseReviewById(reviewId: number, courseType: CourseType): Promise<Review> {
        return launch(async () => {
            if (this.isOfflineCourse(courseType)) {
                const review = await this.repository.getOfflineCourseReviewById(reviewId)
                if (!isEmpty(review)) {
                    return new OfflineCourseReviewToReviewMapper().map(review)
                } else {
                    return null
                }
            } else {
                // todo online course
                return null
            }
        })
    }

    /**
     * Check is offline course
     * @param courseType
     * @private
     */
    private isOfflineCourse(courseType: CourseType): boolean {
        return courseType === CourseType.OFFLINE_SINGLE || courseType === CourseType.OFFLINE_GROUP
    }
}