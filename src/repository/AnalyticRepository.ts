import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { AnalyticError } from "../core/exceptions/constants/analytic-error.enum"
import { TutorAnalyticRecencyEntity } from "../entity/analytic/TutorAnalyticRecency.entity"
import { TutorAnalyticFrequencyEntity } from "../entity/analytic/TutorAnalyticFrequency.entity"

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
            await queryRunner
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
     * Get tutor statistic entity
     * @param tutorId
     * @private
     */
    private async getTutorStatistic(tutorId: string): Promise<TutorStatisticEntity> {
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
    private async getTutorRecency(tutorId: string): Promise<TutorAnalyticRecencyEntity> {
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
    private async getTutorFrequency(tutorId: string): Promise<TutorAnalyticFrequencyEntity> {
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
    private async getTutorMonetary(tutorId: string): Promise<TutorAnalyticMonetaryEntity> {
        try {
            return await this.connection.getRepository(TutorAnalyticMonetaryEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor monetary analytic", AnalyticError.CAN_NOT_GET_TUTOR_MONETARY)
        }
    }
}

export default AnalyticRepository