import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import AnalyticManager from "./AnalyticManager"
import { logger } from "../core/logging/Logger"

/**
 * Analytic scheduler
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class AnalyticScheduler {
    constructor(private readonly analytic: AnalyticManager) {
    }

    /**
     * update online course rank
     */
    @Cron(CronExpression.EVERY_3_HOURS)
    async handleCron() {
        try {
            logger.info("Run online course analytic")
            await this.analytic.updateOnlineCourseRank()
            logger.info("Run online course analytic finished")
        } catch (error) {
            logger.error(error)
        }
    }
}