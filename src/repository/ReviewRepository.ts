import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { OfflineCourseRatingTransactionEntity } from "../entity/course/offline/offlineCourseRatingTransaction.entity"
import ReviewForm from "../model/review/ReviewForm"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { OfflineCourseRatingEntity } from "../entity/course/offline/offlineCourseRating.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { ReviewError } from "../core/exceptions/constants/review-error.enum"

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
     * @param learner
     * @param course
     * @param updatedRating
     * @param updatedReviewNumber
     */
    async createOfflineCourseReview(
        data: ReviewForm,
        learner: LearnerEntity,
        course: OfflineCourseEntity,
        updatedRating: number,
        updatedReviewNumber: number
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const review = new OfflineCourseRatingTransactionEntity()
            review.learner = learner
            review.course = course
            review.rating = data.rating
            review.review = data.comment

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(review)
            await queryRunner.manager.update(OfflineCourseRatingEntity,
                { course: course },
                {
                    reviewNumber: updatedReviewNumber,
                    rating: updatedRating
                })
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
    async getOfflineCourseRating(courseId: string): Promise<OfflineCourseRatingEntity> {
        try {
            return await this.connection.getRepository(OfflineCourseRatingEntity)
                .findOne({
                    where: {
                        course: courseId
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not course rating", ReviewError.CAN_NOT_GET_COURSE_RATING)
        }
    }

    /**
     * Get offline course rating from user
     * @param courseId
     * @param learnerId
     */
    async getOfflineCourseRatingByUser(courseId: string, learnerId: string): Promise<OfflineCourseRatingTransactionEntity> {
        try {
            return await this.connection.getRepository(OfflineCourseRatingTransactionEntity)
                .findOne({
                    where: {
                        learner: learnerId,
                        course: courseId
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user rating to course", ReviewError.CAN_NOT_GET_COURSE_RATING_BY_LEARNER)
        }
    }

    /**
     * Update offline course review
     * @param data
     * @param learner
     * @param course
     * @param updatedRating
     * @param updatedReviewNumber
     */
    async updateOfflineCourseReview(
        data: ReviewForm,
        learner: LearnerEntity,
        course: OfflineCourseEntity,
        updatedRating: number,
        updatedReviewNumber: number
    ) {
        const queryRunner = await this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(OfflineCourseRatingTransactionEntity,
                {
                    learner: learner,
                    course: course
                },
                {
                    rating: data.rating,
                    review: data.comment,
                    reviewDate: new Date()
                })
            await queryRunner.manager.update(OfflineCourseRatingEntity,
                { course: course },
                {
                    reviewNumber: updatedReviewNumber,
                    rating: updatedRating
                })

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
     * @param course
     * @param userReview
     * @param updatedRating
     * @param updatedReviewNumber
     */
    async deleteOfflineReview(
        course: OfflineCourseEntity,
        userReview: OfflineCourseRatingTransactionEntity,
        updatedRating: number,
        updatedReviewNumber: number
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.remove(userReview)
            await queryRunner.manager.update(OfflineCourseRatingEntity,
                { course: course },
                {
                    reviewNumber: updatedReviewNumber,
                    rating: updatedRating
                })

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
     * Get offline course review from learner id
     * @param courseId
     * @param learnerId
     */
    async getOfflineCourseReviewByUser(courseId: string, learnerId: string): Promise<OfflineCourseRatingTransactionEntity> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseRatingTransactionEntity, "review")
                .leftJoinAndSelect("review.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("review.courseId like :courseId", { courseId: courseId })
                .andWhere("review.learnerId like :learnerId", { learnerId: learnerId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }

    /**
     * Get offline course review from course id
     * @param courseId
     * @param learnerId
     */
    async getOfflineCourseReview(courseId: string, learnerId?: string): Promise<OfflineCourseRatingTransactionEntity[]> {
        try {
            if (learnerId) {
                return await this.connection.createQueryBuilder(OfflineCourseRatingTransactionEntity, "review")
                    .leftJoinAndSelect("review.learner", "learner")
                    .leftJoinAndSelect("learner.member", "member")
                    .where("review.courseId like :courseId", { courseId: courseId })
                    .andWhere("review.learnerId not like :learnerId", { learnerId: learnerId })
                    .orderBy("review.rating", "DESC")
                    .orderBy("review.reviewDate", "DESC")
                    .getMany()
            } else {
                return await this.connection.createQueryBuilder(OfflineCourseRatingTransactionEntity, "review")
                    .leftJoinAndSelect("review.learner", "learner")
                    .leftJoinAndSelect("learner.member", "member")
                    .where("review.courseId like :courseId", { courseId: courseId })
                    .orderBy("review.rating", "DESC")
                    .orderBy("review.reviewDate", "DESC")
                    .getMany()
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user review", ReviewError.CAN_NOT_GET_COURSE_REVIEW)
        }
    }
}

export default ReviewRepository