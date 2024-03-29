import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { OfflineCourseRatingTransactionEntity } from "../entity/course/offline/offlineCourseRatingTransaction.entity"
import ReviewForm from "../model/review/ReviewForm"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { ReviewError } from "../core/exceptions/constants/review-error.enum"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
import { ClipRatingTransactionEntity } from "../entity/course/clip/ClipRatingTransaction.entity"
import { OfflineCourseStatisticEntity } from "../entity/course/offline/OfflineCourseStatistic.entity"
import LearnerProfile from "../model/profile/LearnerProfile"
import { OnlineCourseStatisticEntity } from "../entity/course/online/OnlineCourseStatistic.entity"
import { ClipStatisticEntity } from "../entity/course/clip/ClipStatistic.entity"

/**
 * Repository for review
 * @author oritalno11 2021 A.D.
 */
@Injectable()
class ReviewRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Create offline course rating
     * @param data
     * @param userId
     * @param courseId
     * @param statistic
     */
    async createOfflineCourseReview(
        data: ReviewForm,
        userId: string,
        courseId: string,
        statistic: OfflineCourseStatisticEntity
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const learner = new LearnerEntity()
            learner.id = LearnerProfile.getLearnerId(userId)

            const course = new OfflineCourseEntity()
            course.id = courseId

            const review = new OfflineCourseRatingTransactionEntity()
            review.learner = learner
            review.course = course
            review.rating = data.rating
            review.review = data.comment

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(review)
            await queryRunner.manager.save(statistic)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create review", ReviewError.CAN_NOT_CREATE_REVIEW)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get offline course average rating
     * @param courseId
     */
    async getOfflineCourseStatistic(courseId: string): Promise<OfflineCourseStatisticEntity> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseStatisticEntity, "statistic")
                .innerJoinAndSelect("statistic.course", "course")
                .where("statistic.course like :courseId", { courseId: courseId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not course rating", ReviewError.CAN_NOT_GET_COURSE_RATING)
        }
    }

    /**
     * Get offline course rating from user
     * @param reviewId
     */
    async getOfflineCourseRatingByUser(reviewId: number): Promise<number> {
        try {
            const { rating_rating } = await this.connection.getRepository(OfflineCourseRatingTransactionEntity)
                .createQueryBuilder("rating")
                .select("rating.rating")
                .where("rating.id = :reviewId", { reviewId: reviewId })
                .getRawOne()
            return rating_rating
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user rating to course", ReviewError.CAN_NOT_GET_COURSE_RATING_BY_LEARNER)
        }
    }

    /**
     * Update offline course review
     * @param data
     * @param statistic
     */
    async updateOfflineCourseReview(
        data: ReviewForm,
        statistic: OfflineCourseStatisticEntity
    ) {
        const queryRunner = await this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(OfflineCourseRatingTransactionEntity,
                { id: data.reviewId },
                {
                    rating: data.rating,
                    review: data.comment,
                    reviewDate: new Date()
                })
            await queryRunner.manager.save(statistic)

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update review", ReviewError.CAN_NOT_UPDATE_REVIEW)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Delete offline course review
     * @param reviewId
     * @param statistic
     */
    async deleteOfflineReview(
        reviewId: number,
        statistic: OfflineCourseStatisticEntity
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.delete(OfflineCourseRatingTransactionEntity, reviewId)
            await queryRunner.manager.save(statistic)

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not delete review", ReviewError.CAN_NOT_DELETE_REVIEW)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get Offline course review by id
     * @param reviewId
     */
    async getOfflineCourseReviewById(reviewId: number): Promise<OfflineCourseRatingTransactionEntity> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseRatingTransactionEntity, "review")
                .leftJoinAndSelect("review.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("review.id like :reviewId", { reviewId: reviewId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }

    /**
     * Get offline course review from course id
     * @param courseId
     */
    async getOfflineCourseReview(courseId: string): Promise<OfflineCourseRatingTransactionEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseRatingTransactionEntity, "review")
                .leftJoinAndSelect("review.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("review.courseId like :courseId", { courseId: courseId })
                .orderBy("review.rating", "DESC")
                .orderBy("review.reviewDate", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }

    /**
     * Create online course review
     * @param data
     * @param userId
     * @param courseId
     * @param clipId
     * @param courseStatistic
     * @param clipStatistic
     */
    async createOnlineCourseReview(
        data: ReviewForm,
        userId: string,
        courseId: string,
        clipId: string,
        courseStatistic: OnlineCourseStatisticEntity,
        clipStatistic: ClipStatisticEntity
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const learner = new LearnerEntity()
            learner.id = LearnerProfile.getLearnerId(userId)

            const clip = new ClipEntity()
            clip.id = clipId

            const review = new ClipRatingTransactionEntity()
            review.learner = learner
            review.clip = clip
            review.rating = data.rating
            review.review = data.comment

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(review)
            await queryRunner.manager.save(clipStatistic)
            await queryRunner.manager.save(courseStatistic)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create review", ReviewError.CAN_NOT_CREATE_REVIEW)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get online course rating
     * @param courseId
     */
    async getOnlineCourseStatistic(courseId: string): Promise<OnlineCourseStatisticEntity> {
        try {
            return await this.connection.createQueryBuilder(OnlineCourseStatisticEntity, "statistic")
                .innerJoinAndSelect("statistic.onlineCourse", "course")
                .where("statistic.onlineCourse like :courseId", { courseId: courseId})
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get course rating", ReviewError.CAN_NOT_GET_COURSE_RATING)
        }
    }

    /**
     * Get clip rating
     * @param clipId
     */
    async getClipStatistic(clipId: string): Promise<ClipStatisticEntity> {
        try {
            return await this.connection.createQueryBuilder(ClipStatisticEntity, "statistic")
                .innerJoinAndSelect("statistic.clip", "clip")
                .where("statistic.clip like :clipId", { clipId: clipId})
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get clip rating", ReviewError.CAN_NOT_GET_CLIP_RATING)
        }
    }

    /**
     * Get clip rating by user
     * @param reviewId
     */
    async getClipRatingByUser(reviewId: number): Promise<number> {
        try {
            const { rating_rating } = await this.connection.createQueryBuilder(ClipRatingTransactionEntity, "rating")
                .select("rating.rating")
                .where("rating.id = :reviewId", { reviewId: reviewId })
                .getRawOne()
            return rating_rating
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user rating to course", ReviewError.CAN_NOT_GET_COURSE_RATING_BY_LEARNER)
        }
    }

    /**
     * Update Clip review
     * @param data
     * @param courseStatistic
     * @param clipStatistic
     */
    async updateOnlineCourseReview(
        data: ReviewForm,
        courseStatistic: OnlineCourseStatisticEntity,
        clipStatistic: ClipStatisticEntity
    ) {
        const queryRunner = await this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(ClipRatingTransactionEntity,
                { id: data.reviewId },
                {
                    rating: data.rating,
                    review: data.comment,
                    reviewDate: new Date()
                })
            await queryRunner.manager.save(clipStatistic)
            await queryRunner.manager.save(courseStatistic)

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update review", ReviewError.CAN_NOT_UPDATE_REVIEW)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get clip review by review id
     * @param reviewId
     */
    async getClipReviewById(reviewId: number): Promise<ClipRatingTransactionEntity> {
        try {
            return await this.connection.createQueryBuilder(ClipRatingTransactionEntity, "review")
                .leftJoinAndSelect("review.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("review.id like :reviewId", { reviewId: reviewId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }

    /**
     * Get all clip review
     * @param clipId
     */
    async getClipCourseReview(clipId: string): Promise<ClipRatingTransactionEntity[]> {
        try {
            return await this.connection.createQueryBuilder(ClipRatingTransactionEntity, "review")
                .leftJoinAndSelect("review.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("review.clip like :clipId", { clipId: clipId })
                .orderBy("review.rating", "DESC")
                .orderBy("review.reviewDate", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }

    /**
     * Get top 20 review for online course by course id
     * @param courseId
     */
    async getOnlineCourseReview(courseId: string): Promise<ClipRatingTransactionEntity[]> {
        try {
            return await this.connection.createQueryBuilder(ClipRatingTransactionEntity, "review")
                .leftJoinAndSelect("review.learner", "learner")
                .leftJoinAndSelect("review.clip", "clip")
                .leftJoinAndSelect("clip.onlineCourse", "course")
                .leftJoinAndSelect("learner.member", "member")
                .where("course.id like :courseId", { courseId: courseId })
                .orderBy("review.rating", "DESC")
                .orderBy("review.reviewDate", "DESC")
                .limit(20)
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }

    /**
     * Delete clip review
     * @param reviewId
     * @param courseStatistic
     * @param clipStatistic
     */
    async deleteClipReview(
        reviewId: number,
        courseStatistic: OnlineCourseStatisticEntity,
        clipStatistic: ClipStatisticEntity
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.delete(ClipRatingTransactionEntity, reviewId)
            await queryRunner.manager.save(clipStatistic)
            await queryRunner.manager.save(courseStatistic)

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not delete review", ReviewError.CAN_NOT_DELETE_REVIEW)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get course owner id by course id
     * @param courseId
     * @param offline
     */
    async getCourseOwnerById(courseId: string, offline: boolean): Promise<string> {
        try {
            if (offline) {
                const { ownerId } = await this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                    .select("course.ownerId")
                    .where("course.id like :courseId", { courseId: courseId })
                    .getRawOne()
                return ownerId
            } else {
                const { ownerId } = await this.connection.createQueryBuilder(OnlineCourseEntity, "course")
                    .select("course.ownerId")
                    .where("course.id like :courseId", { courseId: courseId })
                    .getRawOne()
                return ownerId
            }
        } catch (error) {
            logger.error(error)
        }
    }
}

export default ReviewRepository