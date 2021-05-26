import { Injectable } from "@nestjs/common"
import ReviewRepository from "../../../repository/ReviewRepository"
import ReviewForm from "../../../model/review/ReviewForm"
import User from "../../../model/User"
import { launch } from "../../../core/common/launch"
import UserUtil from "../../../utils/UserUtil"
import { isNotEmpty } from "../../../core/extension/CommonExtension"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"
import { CourseType } from "../../../model/course/data/CourseType"
import { UserRole } from "../../../core/constant/UserRole"
import { OfflineCourseReviewToReviewMapper } from "../../../utils/mapper/course/offline/OfflineCourseReviewToReviewMapper"
import Review from "../../../model/review/Review"
import RatingUtil from "../../../utils/rating/RatingUtil"
import AnalyticManager from "../../../analytic/AnalyticManager"
import { ReviewError } from "../../../core/exceptions/constants/review-error.enum"
import { OfflineCourseEntity } from "../../../entity/course/offline/offlineCourse.entity"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { ClipError } from "../../../core/exceptions/constants/clip-error.enum"
import { OnlineCourseEntity } from "../../../entity/course/online/OnlineCourse.entity"
import { ClipReviewToReviewMapper } from "../../../utils/mapper/clip/ClipReviewToReview.mapper"
import { OfflineCourseRatingTransactionEntity } from "../../../entity/course/offline/offlineCourseRatingTransaction.entity"
import { ClipRatingTransactionEntity } from "../../../entity/course/clip/ClipRatingTransaction.entity"

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
     * Create course and clip review
     * @param data
     * @param user
     */
    createReview(data: ReviewForm, user: User) {
        return launch(async () => {
            const learner = await this.userUtil.getLearner(user.id)
            const isOfflineCourse = this.isOfflineCourse(data.courseType)
            const isReviewed = isOfflineCourse ? await this.userUtil.isReviewCourse(user.id, data.courseId) : await this.userUtil.isReviewClip(user.id, data.clipId)

            if (!isReviewed) {
                const enrolledCourse = await this.userUtil.getEnrolled(user.id, data.courseId, isOfflineCourse)
                if (isNotEmpty(enrolledCourse)) {
                    if (enrolledCourse instanceof OfflineCourseEntity) {
                        const courseRating = await this.repository.getOfflineCourseRating(data.courseId)

                        const updatedRating = RatingUtil.calculateIncreaseRatingAvg(courseRating.rating, data.rating, courseRating.reviewNumber)
                        const updatedReviewNumber = courseRating.reviewNumber + 1

                        await this.repository.createOfflineCourseReview(data, learner, enrolledCourse, updatedRating, updatedReviewNumber)
                        await this.analytic.trackLearnerReviewOfflineCourse(enrolledCourse.owner?.id, data.rating)
                    } else if (enrolledCourse instanceof OnlineCourseEntity) {
                        const subscribeClip = await this.userUtil.getSubscribeClip(user.id, data.clipId)
                        if (isNotEmpty(subscribeClip)) {
                            const courseRating = await this.repository.getOnlineCourseRating(data.courseId)
                            const clipRating = await this.repository.getClipRating(data.clipId)

                            const updateCourseRating = RatingUtil.calculateIncreaseRatingAvg(courseRating.rating, data.rating, courseRating.reviewNumber)
                            const updateCourseReviewNumber = courseRating.reviewNumber + 1

                            const updateClipRating = RatingUtil.calculateIncreaseRatingAvg(clipRating.rating, data.rating, clipRating.reviewNumber)
                            const updateClipReviewNumber = clipRating.reviewNumber + 1

                            await this.repository.createOnlineCourseReview(
                                data,
                                learner,
                                enrolledCourse,
                                subscribeClip,
                                updateCourseRating,
                                updateCourseReviewNumber,
                                updateClipRating,
                                updateClipReviewNumber
                            )
                            await this.analytic.trackLearnerReviewOnlineCourse(enrolledCourse.owner?.id, data.rating)
                        } else {
                            throw ErrorExceptions.create("Your is not subscribe this clip", ClipError.NOT_SUBSCRIBE)
                        }
                    } else {
                        throw ErrorExceptions.create("Unexpected", CommonError.UNEXPECTED_ERROR)
                    }
                } else {
                    throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
                }
            } else {
                throw ErrorExceptions.create("Your already review", ReviewError.ALREADY_REVIEW)
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
                const userRating = isOfflineCourse ? await this.repository.getOfflineCourseRatingByUser(data.reviewId) : await this.repository.getClipRatingByUser(data.reviewId)
                if (isNotEmpty(userRating)) {
                    if (enrolledCourse instanceof OfflineCourseEntity) {
                        const courseRating = await this.repository.getOfflineCourseRating(data.courseId)

                        const updatedRating = RatingUtil.calculateUpdateRatingAvg(
                            courseRating.rating,
                            data.rating,
                            userRating.rating,
                            courseRating.reviewNumber
                        )

                        await this.repository.updateOfflineCourseReview(data, enrolledCourse, updatedRating, courseRating.reviewNumber)
                        await this.analytic.trackLearnerReviewOfflineCourse(enrolledCourse.owner?.id, data.rating, false, userRating.rating)
                    } else if (enrolledCourse instanceof OnlineCourseEntity) {
                        const subscribeClip = await this.userUtil.getSubscribeClip(user.id, data.clipId)
                        if (isNotEmpty(subscribeClip)) {
                            const courseRating = await this.repository.getOnlineCourseRating(data.courseId)
                            const clipRating = await this.repository.getClipRating(data.clipId)

                            const updatedCourseRating = RatingUtil.calculateUpdateRatingAvg(
                                courseRating.rating,
                                data.rating,
                                userRating.rating,
                                courseRating.reviewNumber
                            )

                            const updateClipRating = RatingUtil.calculateUpdateRatingAvg(
                                clipRating.rating,
                                data.rating,
                                userRating.rating,
                                clipRating.reviewNumber
                            )

                            await this.repository.updateOnlineCourseReview(
                                data,
                                enrolledCourse,
                                subscribeClip,
                                updatedCourseRating,
                                courseRating.reviewNumber,
                                updateClipRating,
                                clipRating.reviewNumber
                            )
                            await this.analytic.trackLearnerReviewOnlineCourse(enrolledCourse.owner?.id, data.rating, false, userRating.rating)
                        } else {
                            throw ErrorExceptions.create("Your is not subscribe this clip", ClipError.NOT_SUBSCRIBE)
                        }
                    } else {
                        throw ErrorExceptions.create("Unexpected", CommonError.UNEXPECTED_ERROR)
                    }
                } else {
                    throw ErrorExceptions.create("Can not found review", ReviewError.CAN_NOT_FOUND_REVIEW)
                }
            } else {
                throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
            }
        })
    }

    /**
     * Delete course review
     * @param reviewId
     * @param courseId
     * @param courseType
     * @param user
     * @param clipId
     */
    deleteReview(reviewId: number, courseId: string, courseType: CourseType, user: User, clipId?: string) {
        return launch(async () => {
            const isOfflineCourse = this.isOfflineCourse(courseType)
            const enrolledCourse = await this.userUtil.getEnrolled(user.id, courseId, isOfflineCourse)
            if (isNotEmpty(enrolledCourse)) {
                const userRating = isOfflineCourse ? await this.repository.getOfflineCourseRatingByUser(reviewId) : await this.repository.getClipRatingByUser(reviewId)
                if (isNotEmpty(userRating)) {
                    if (enrolledCourse instanceof OfflineCourseEntity && userRating instanceof OfflineCourseRatingTransactionEntity) {
                        const courseRating = await this.repository.getOfflineCourseRating(courseId)

                        const decreaseRating = RatingUtil.calculateDecreaseRatingAvg(courseRating.rating, userRating.rating, courseRating.reviewNumber)
                        const decreaseReviewNumber = courseRating.reviewNumber - 1

                        await this.repository.deleteOfflineReview(enrolledCourse, userRating, decreaseRating, decreaseReviewNumber)
                        await this.analytic.trackLearnerReviewOfflineCourse(enrolledCourse.owner?.id, 0.0, false, userRating.rating)
                    } else if (enrolledCourse instanceof OnlineCourseEntity && userRating instanceof ClipRatingTransactionEntity) {
                        const subscribeClip = await this.userUtil.getSubscribeClip(user.id, clipId)
                        if (isNotEmpty(subscribeClip)) {
                            const courseRating = await this.repository.getOnlineCourseRating(courseId)
                            const clipRating = await this.repository.getClipRating(clipId)

                            const updatedCourseRating = RatingUtil.calculateDecreaseRatingAvg(courseRating.rating, userRating.rating, courseRating.reviewNumber)

                            const updateClipRating = RatingUtil.calculateDecreaseRatingAvg(clipRating.rating, userRating.rating, clipRating.reviewNumber)

                            await this.repository.deleteClipReview(
                                enrolledCourse,
                                subscribeClip,
                                userRating,
                                updatedCourseRating,
                                courseRating.reviewNumber - 1,
                                updateClipRating,
                                clipRating.reviewNumber - 1
                            )
                            await this.analytic.trackLearnerReviewOnlineCourse(enrolledCourse.owner?.id, 0.0, false, userRating.rating)
                        } else {
                            throw ErrorExceptions.create("Your is not subscribe this clip", ClipError.NOT_SUBSCRIBE)
                        }
                    } else {
                        throw ErrorExceptions.create("Unexpected", CommonError.UNEXPECTED_ERROR)
                    }
                } else {
                    throw ErrorExceptions.create("Can not found review", ReviewError.CAN_NOT_FOUND_REVIEW)
                }
            } else {
                throw ErrorExceptions.create("Your is not enroll this course", CourseError.NOT_ENROLLED)
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
                const allReview = await this.repository.getOfflineCourseReview(courseId)
                let userReview
                if (user && user.role === UserRole.LEARNER) {
                    userReview = await this.userUtil.getCourseReview(user.id, courseId)
                }
                return new OfflineCourseReviewToReviewMapper().mapList(allReview, userReview)
            } else {
                const reviews = await this.repository.getOnlineCourseReview(courseId)
                return new ClipReviewToReviewMapper().mapCourseList(reviews)
            }
        })
    }

    /**
     * Get clip review
     * @param clipId
     * @param user
     */
    getClipReview(clipId: string, user: User): Promise<Review[]> {
        return launch(async () => {
            const allReview = await this.repository.getClipCourseReview(clipId)
            let userReview
            if (user && user.role === UserRole.LEARNER) {
                userReview = await this.userUtil.getClipReview(user.id, clipId)
            }
            return new ClipReviewToReviewMapper().mapList(allReview, userReview)
        })
    }


    /**
     * Get course review by review id
     * @param reviewId
     * @param courseType
     */
    getReviewById(reviewId: number, courseType: CourseType): Promise<Review> {
        return launch(async () => {
            if (this.isOfflineCourse(courseType)) {
                const review = await this.repository.getOfflineCourseReviewById(reviewId)
                return isNotEmpty(review) ? new OfflineCourseReviewToReviewMapper().map(review) : null
            } else {
                const review = await this.repository.getClipReviewById(reviewId)
                return isNotEmpty(review) ? new ClipReviewToReviewMapper().map(review) : null
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