import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { AnalyticError } from "../core/exceptions/constants/analytic-error.enum"

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
            const statistic = await queryRunner.manager.findOne(TutorStatisticEntity, {
                where: {
                    tutor: tutorId
                }
            })
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
            const monetary = await queryRunner.manager.findOne(TutorAnalyticMonetaryEntity, {
                where: {
                    tutor: tutorId
                }
            })
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
            const statistic = await queryRunner.manager.findOne(TutorStatisticEntity, {
                where: {
                    tutor: tutorId
                }
            })
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
            const monetary = await queryRunner.manager.findOne(TutorAnalyticMonetaryEntity, {
                where: {
                    tutor: tutorId
                }
            })
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
}

export default AnalyticRepository