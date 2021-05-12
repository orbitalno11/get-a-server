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
}

export default ReviewRepository