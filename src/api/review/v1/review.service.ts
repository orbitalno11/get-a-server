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
import { OfflineCourseStatisticEntity } from "../../../entity/course/offline/OfflineCourseStatistic.entity"

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
            const isOfflineCourse = this.isOfflineCourse(data.courseType)
            const isReviewed = isOfflineCourse ? await this.userUtil.isReviewCourse(user.id, data.courseId) : await this.userUtil.isReviewClip(user.id, data.clipId)

            if (isReviewed) {
                throw ErrorExceptions.create("Your already review", ReviewError.ALREADY_REVIEW)
            }

            const enrolled = await this.userUtil.isEnrolled(user.id, data.courseId, isOfflineCourse)

            if (!enrolled) {
                throw ErrorExceptions.create("Your are not enroll this course", CourseError.NOT_ENROLLED)
            }

            const tutorId = await this.repository.getCourseOwnerById(data.courseId, isOfflineCourse)

            if (isOfflineCourse) {
                // offline course
                let courseStatistic = await this.repository.getOfflineCourseStatistic(data.courseId)

                courseStatistic = this.updateStatisticStar(data.rating, courseStatistic, true)
                courseStatistic.rating = RatingUtil.calculateIncreaseRatingAvg(courseStatistic.rating, data.rating, courseStatistic.numberOfReview)
                courseStatistic.numberOfReview += 1

                await this.repository.createOfflineCourseReview(data, user.id, data.courseId, courseStatistic)
            } else {
                // online course
                const isSubscribe = await this.userUtil.isSubscribeClip(user.id, data.clipId)

                if (!isSubscribe) {
                    throw ErrorExceptions.create("Your is not subscribe this clip", ClipError.NOT_SUBSCRIBE)
                }

                let courseStatistic = await this.repository.getOnlineCourseStatistic(data.courseId)
                let clipStatistic = await this.repository.getClipRating(data.clipId)

                courseStatistic = this.updateStatisticStar(data.rating, courseStatistic, true)
                courseStatistic.rating = RatingUtil.calculateIncreaseRatingAvg(courseStatistic.rating, data.rating, courseStatistic.numberOfReview)
                courseStatistic.numberOfReview += 1

                clipStatistic = this.updateStatisticStar(data.rating, clipStatistic, true)
                clipStatistic.rating = RatingUtil.calculateIncreaseRatingAvg(clipStatistic.rating, data.rating, clipStatistic.numberOfReview)
                clipStatistic.numberOfReview += 1

                await this.repository.createOnlineCourseReview(data, user.id, data.courseId, data.clipId, courseStatistic, clipStatistic)
            }
            await this.analytic.trackLearnerReview(tutorId, data.rating, isOfflineCourse)
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
            const enrolled = await this.userUtil.isEnrolled(user.id, data.courseId, isOfflineCourse)

            if (!enrolled) {
                throw ErrorExceptions.create("Your are not enroll this course", CourseError.NOT_ENROLLED)
            }

            const userRating = await this.repository.getOfflineCourseRatingByUser(data.reviewId)

            if (!userRating?.isSafeNumber()) {
                throw ErrorExceptions.create("Can not found review", ReviewError.CAN_NOT_FOUND_REVIEW)
            }

            const tutorId = await this.repository.getCourseOwnerById(data.courseId, isOfflineCourse)

            if (isOfflineCourse) {
                // offline course
                let courseStatistic = await this.repository.getOfflineCourseStatistic(data.courseId)

                courseStatistic = this.updateStatisticStar(userRating, courseStatistic, false)
                courseStatistic = this.updateStatisticStar(data.rating, courseStatistic, true)

                courseStatistic.rating = RatingUtil.calculateUpdateRatingAvg(
                    courseStatistic.rating,
                    data.rating,
                    userRating,
                    courseStatistic.numberOfReview
                )

                await this.repository.updateOfflineCourseReview(data, courseStatistic)
                await this.analytic.trackLearnerReview(tutorId, data.rating, true, false, userRating)
            } else {
                // online course
                // const subscribeClip = await this.userUtil.getSubscribeClip(user.id, data.clipId)
                // if (isNotEmpty(subscribeClip)) {
                //     const courseRating = await this.repository.getOnlineCourseRating(data.courseId)
                //     const clipRating = await this.repository.getClipRating(data.clipId)
                //
                //     const updatedCourseRating = RatingUtil.calculateUpdateRatingAvg(
                //         courseRating.rating,
                //         data.rating,
                //         userRating.rating,
                //         courseRating.reviewNumber
                //     )
                //
                //     const updateClipRating = RatingUtil.calculateUpdateRatingAvg(
                //         clipRating.rating,
                //         data.rating,
                //         userRating.rating,
                //         clipRating.reviewNumber
                //     )
                //
                //     await this.repository.updateOnlineCourseReview(
                //         data,
                //         enrolledCourse,
                //         subscribeClip,
                //         updatedCourseRating,
                //         courseRating.reviewNumber,
                //         updateClipRating,
                //         clipRating.reviewNumber
                //     )
                //     await this.analytic.trackLearnerReviewOnlineCourse(enrolledCourse.owner?.id, data.rating, false, userRating.rating)
                // } else {
                //     throw ErrorExceptions.create("Your is not subscribe this clip", ClipError.NOT_SUBSCRIBE)
                // }
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
            const enrolled = await this.userUtil.isEnrolled(user.id, courseId, isOfflineCourse)

            if (!enrolled) {
                throw ErrorExceptions.create("Your are not enroll this course", CourseError.NOT_ENROLLED)
            }

            const userRating = await this.repository.getOfflineCourseRatingByUser(reviewId)

            if (!userRating?.isSafeNumber()) {
                throw ErrorExceptions.create("Can not found review", ReviewError.CAN_NOT_FOUND_REVIEW)
            }

            const tutorId = await this.repository.getCourseOwnerById(courseId, isOfflineCourse)

            if (isOfflineCourse) {
                // offline course
                let courseStatistic = await this.repository.getOfflineCourseStatistic(courseId)

                courseStatistic = this.updateStatisticStar(userRating, courseStatistic, false)

                courseStatistic.rating = RatingUtil.calculateDecreaseRatingAvg(courseStatistic.rating, userRating, courseStatistic.numberOfReview)
                courseStatistic.numberOfReview -= 1

                await this.repository.deleteOfflineReview(reviewId, courseStatistic)
                await this.analytic.trackLearnerReview(tutorId, 0.0, true, false, userRating)
            } else {
                // online course
                // const subscribeClip = await this.userUtil.getSubscribeClip(user.id, clipId)
                // if (isNotEmpty(subscribeClip)) {
                //     const courseRating = await this.repository.getOnlineCourseRating(courseId)
                //     const clipRating = await this.repository.getClipRating(clipId)
                //
                //     const updatedCourseRating = RatingUtil.calculateDecreaseRatingAvg(courseRating.rating, userRating.rating, courseRating.reviewNumber)
                //
                //     const updateClipRating = RatingUtil.calculateDecreaseRatingAvg(clipRating.rating, userRating.rating, clipRating.reviewNumber)
                //
                //     await this.repository.deleteClipReview(
                //         enrolledCourse,
                //         subscribeClip,
                //         userRating,
                //         updatedCourseRating,
                //         courseRating.reviewNumber - 1,
                //         updateClipRating,
                //         clipRating.reviewNumber - 1
                //     )
                //     await this.analytic.trackLearnerReviewOnlineCourse(enrolledCourse.owner?.id, 0.0, false, userRating.rating)
                // } else {
                //     throw ErrorExceptions.create("Your is not subscribe this clip", ClipError.NOT_SUBSCRIBE)
                // }
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

    /**
     * Update statistic star number
     * @param rating
     * @param statistic
     * @param increase
     * @private
     */
    private updateStatisticStar<T>(
        rating: number,
        statistic: T,
        increase: boolean = true
    ): T {
        const ratingKey = this.mapRatingKey(rating)
        if (ratingKey.isSafeNotBlank()) {
            if (increase) {
                statistic[ratingKey] += 1
            } else {
                statistic[ratingKey] -= 1
            }
        } else {
            throw ErrorExceptions.create("Can not update course statistic", CourseError.CAN_NOT_UPDATE_COURSE_STATISTIC)
        }
        return statistic
    }

    private mapRatingKey(rating: number): string {
        switch (rating) {
            case 1:
                return "oneStar"
            case 2:
                return "twoStar"
            case 3:
                return "threeStar"
            case 4:
                return "fourStar"
            case 5:
                return "fiveStar"
            default:
                return ""
        }
    }
}