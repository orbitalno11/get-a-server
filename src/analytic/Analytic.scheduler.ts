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
     * Update tutor and online course rank
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    handleCron() {
        Promise.all([this.updateOnlineCourseRank(1), this.updateTutorRank(1)]).then((value) => {
            if (value[0] && value[1]) {
                this.analytic.clearAnalyticData()
            }
        }).catch((error) => {
            logger.error(error)
        })
    }

    /**
     * Update online course rank
     * @param round
     * @private
     */
    private async updateOnlineCourseRank(round: number): Promise<boolean> {
        try {
            if (round > 50) {
                return false
            }
            logger.info("Run online course analytic")
            await this.analytic.updateOnlineCourseRank()
            logger.info("Run online course analytic finished")
            return true
        } catch (error) {
            await this.updateOnlineCourseRank(round + 1)
        }
    }

    /**
     * Update tutor rank
     * @param round
     * @private
     */
    private async updateTutorRank(round: number): Promise<boolean> {
        try {
            if (round > 50) {
                return false
            }
            logger.info("Run tutor analytic")
            await this.analytic.updateTutorRank()
            logger.info("Run tutor analytic finished")
            return true
        } catch (error) {
            await this.updateTutorRank(round + 1)
        }
    }
}