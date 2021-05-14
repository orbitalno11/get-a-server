import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../repository/AnalyticRepository"
import { QueryRunner } from "typeorm"
import { launch } from "../core/common/launch"

/**
 * Analytic manager
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class AnalyticManager {
    constructor(private readonly repository: AnalyticRepository) {
    }

    /**
     * Increase number of learner favorite
     * @param tutorId
     * @param queryRunner
     */
    increaseNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        return launch(async () => {
            await this.repository.increaseStatisticNumberOfFavorite(tutorId, queryRunner)
            await this.repository.increaseMonetaryNumberOfFavorite(tutorId, queryRunner)
        })
    }

    /**
     * Decrease number of learner favorite
     * @param tutorId
     * @param queryRunner
     */
    decreaseNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        return launch(async () => {
            await this.repository.decreaseStatisticNumberOfFavorite(tutorId, queryRunner)
            await this.repository.decreaseMonetaryNumberOfFavorite(tutorId, queryRunner)
        })
    }
}

export default AnalyticManager