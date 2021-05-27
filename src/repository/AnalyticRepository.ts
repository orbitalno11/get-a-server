import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { AnalyticError } from "../core/exceptions/constants/analytic-error.enum"
import { TutorAnalyticRecencyEntity } from "../entity/analytic/TutorAnalyticRecency.entity"
import { TutorAnalyticFrequencyEntity } from "../entity/analytic/TutorAnalyticFrequency.entity"
import { CourseType } from "../model/course/data/CourseType"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { isNotEmpty } from "../core/extension/CommonExtension"

/**
 * Repository for analytic manager
 * @see AnalyticManager
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class AnalyticRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Increase number of learner favorite in tutor statistic
     * @param tutorId
     */
    async increaseStatisticNumberOfFavorite(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const statistic = await this.getTutorStatistic(tutorId)
            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: statistic.numberOfFavorite + 1
                })
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner
        }
    }

    /**
     * Increase number of learner favorite in tutor monetary analytic
     * @param tutorId
     */
    async increaseMonetaryNumberOfFavorite(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const monetary = await this.getTutorMonetary(tutorId)
            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: monetary.numberOfFavorite + 1
                })
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Decrease number of learner favorite in tutor statistic
     * @param tutorId
     */
    async decreaseStatisticNumberOfFavorite(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const statistic = await this.getTutorStatistic(tutorId)
            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: statistic.numberOfFavorite - 1
                })
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Decrease number of learner favorite in tutor monetary analytic
     * @param tutorId
     */
    async decreaseMonetaryNumberOfFavorite(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const monetary = await this.getTutorMonetary(tutorId)
            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: monetary.numberOfFavorite - 1
                })
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor login
     * @param tutorId
     */
    async trackLogin(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const frequency = await this.getTutorFrequency(tutorId)

            await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                { tutor: tutorId },
                {
                    recentLogin: new Date()
                })
            await queryRunner.manager.update(TutorAnalyticFrequencyEntity,
                { tutor: tutorId },
                {
                    numberOfLogin: frequency.numberOfLogin + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor profile view
     * @param tutorId
     */
    async trackProfileView(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const frequency = await this.getTutorFrequency(tutorId)

            await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                { tutor: tutorId },
                {
                    recentProfileView: new Date()
                })
            await queryRunner.manager.update(TutorAnalyticFrequencyEntity,
                { tutor: tutorId },
                {
                    numberOfProfileView: frequency.numberOfProfileView + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor course view
     * @param courseId
     * @param courseType
     */
    async trackImpressCourse(courseId: string, courseType: CourseType) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            let tutorId = ""

            if (courseType === CourseType.OFFLINE_SINGLE || courseType === CourseType.OFFLINE_GROUP) {
                const offlineCourse = await queryRunner.manager.getRepository(OfflineCourseEntity)
                    .findOne({
                        where: {
                            id: courseId
                        },
                        join: {
                            alias: "offlineCourse",
                            leftJoinAndSelect: {
                                owner: "offlineCourse.owner"
                            }
                        }
                    })

                if (isNotEmpty(offlineCourse)) {
                    tutorId = offlineCourse.owner.id
                }
            } else {
                // todo online course
            }

            if (tutorId.isSafeNotBlank()) {
                const frequency = await this.getTutorFrequency(tutorId)
                await queryRunner.manager.update(TutorAnalyticFrequencyEntity,
                    { tutor: tutorId },
                    {
                        numberOfCourseView: frequency.numberOfCourseView + 1
                    })
            }

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor approve learner to course
     * @param tutorId
     */
    async trackTutorApproved(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const monetary = await this.getTutorMonetary(tutorId)
            const statistic = await this.getTutorStatistic(tutorId)

            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    numberOfLearner: monetary.numberOfLearner + 1
                })
            await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                { tutor: tutorId },
                {
                    recentApproved: new Date()
                })
            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    numberOfLearner: statistic.numberOfLearner + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor create offline course
     * @param tutorId
     */
    async trackTutorCreateOfflineCourse(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const statistic = await this.getTutorStatistic(tutorId)

            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    offlineCourseNumber: statistic.offlineCourseNumber + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track learner review offline course
     * TODO Refactor review tracking
     * @param tutorId
     * @param updatedStatisticTutorRating
     * @param updatedStatisticRating
     * @param updatedStatisticReviewNumber
     * @param updatedMonetaryTutorRating
     * @param updatedMonetaryRating
     * @param updatedMonetaryReviewNumber
     * @param deleteReview
     */
    async trackLearnerReviewOfflineCourse(
        tutorId: string,
        updatedStatisticTutorRating: number,
        updatedStatisticRating: number,
        updatedStatisticReviewNumber: number,
        updatedMonetaryTutorRating: number,
        updatedMonetaryRating: number,
        updatedMonetaryReviewNumber: number,
        deleteReview: boolean
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    rating: updatedStatisticTutorRating,
                    offlineRating: updatedStatisticRating,
                    numberOfOfflineReview: updatedStatisticReviewNumber
                })
            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    rating: updatedMonetaryTutorRating,
                    offlineRating: updatedMonetaryRating,
                    numberOfOfflineReview: updatedMonetaryReviewNumber
                })
            if (!deleteReview) {
                await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                    { tutor: tutorId },
                    {
                        recentComment: new Date()
                    })
            }
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor create online course
     * @param tutorId
     */
    async trackCreateOnlineCourse(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            const statistic = await this.getTutorStatistic(tutorId)

            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    onlineCourseNumber: statistic.onlineCourseNumber + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track learner review online course
     * TODO Refactor review tracking
     * @param tutorId
     * @param updatedStatisticTutorRating
     * @param updatedStatisticRating
     * @param updatedStatisticReviewNumber
     * @param updatedMonetaryTutorRating
     * @param updatedMonetaryRating
     * @param updatedMonetaryReviewNumber
     * @param deleteReview
     */
    async trackLearnerReviewOnlineCourse(
        tutorId: string,
        updatedStatisticTutorRating: number,
        updatedStatisticRating: number,
        updatedStatisticReviewNumber: number,
        updatedMonetaryTutorRating: number,
        updatedMonetaryRating: number,
        updatedMonetaryReviewNumber: number,
        deleteReview: boolean
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    rating: updatedStatisticTutorRating,
                    onlineRating: updatedStatisticRating,
                    numberOfOnlineReview: updatedStatisticReviewNumber
                })
            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    rating: updatedMonetaryTutorRating,
                    onlineRating: updatedMonetaryRating,
                    numberOfOnlineReview: updatedMonetaryReviewNumber
                })
            if (!deleteReview) {
                await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                    { tutor: tutorId },
                    {
                        recentComment: new Date()
                    })
            }
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get tutor statistic entity
     * @param tutorId
     * @private
     */
    async getTutorStatistic(tutorId: string): Promise<TutorStatisticEntity> {
        try {
            return await this.connection.getRepository(TutorStatisticEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor recency analytic", AnalyticError.CAN_NOT_GET_TUTOR_RECENCY)
        }
    }

    /**
     * Get tutor recency entity
     * @param tutorId
     * @private
     */
    async getTutorRecency(tutorId: string): Promise<TutorAnalyticRecencyEntity> {
        try {
            return await this.connection.getRepository(TutorAnalyticRecencyEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor recency analytic", AnalyticError.CAN_NOT_GET_TUTOR_RECENCY)
        }
    }

    /**
     * Get tutor frequency entity
     * @param tutorId
     * @private
     */
    async getTutorFrequency(tutorId: string): Promise<TutorAnalyticFrequencyEntity> {
        try {
            return await this.connection.getRepository(TutorAnalyticFrequencyEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor frequency analytic", AnalyticError.CAN_NOT_GET_TUTOR_FREQ)
        }
    }

    /**
     * Get tutor monetary entity
     * @param tutorId
     * @private
     */
    async getTutorMonetary(tutorId: string): Promise<TutorAnalyticMonetaryEntity> {
        try {
            return await this.connection.getRepository(TutorAnalyticMonetaryEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor monetary analytic", AnalyticError.CAN_NOT_GET_TUTOR_MONETARY)
        }
    }
}

export default AnalyticRepository