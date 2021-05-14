import { Injectable } from "@nestjs/common"
import { Connection, QueryRunner } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { AnalyticError } from "../core/exceptions/constants/analytic-error.enum"

@Injectable()
class AnalyticRepository {
    constructor(private readonly connection: Connection) {
    }

    async increaseStatisticNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        try {
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
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        }
    }

    async increaseMonetaryNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        try {
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
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        }
    }

    async decreaseStatisticNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        try {
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
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        }
    }

    async decreaseMonetaryNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        try {
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
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        }
    }
}

export default AnalyticRepository