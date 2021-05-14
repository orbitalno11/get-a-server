import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../repository/AnalyticRepository"
import { QueryRunner } from "typeorm"
import { launch } from "../core/common/launch"

@Injectable()
class AnalyticManager {
    constructor(private readonly repository: AnalyticRepository) {
    }

    increaseNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        return launch(async () => {
            await this.repository.increaseStatisticNumberOfFavorite(tutorId, queryRunner)
            await this.repository.increaseMonetaryNumberOfFavorite(tutorId, queryRunner)
        })
    }

    decreaseNumberOfFavorite(tutorId: string, queryRunner: QueryRunner) {
        return launch(async () => {
            await this.repository.decreaseStatisticNumberOfFavorite(tutorId, queryRunner)
            await this.repository.decreaseMonetaryNumberOfFavorite(tutorId, queryRunner)
        })
    }
}

export default AnalyticManager