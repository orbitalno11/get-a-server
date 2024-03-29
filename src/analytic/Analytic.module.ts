import { Module } from "@nestjs/common"
import { CoreModule } from "../core/core.module"
import { UtilityModule } from "../utils/utility.module"
import { RepositoryModule } from "../repository/repository.module"
import AnalyticManager from "./AnalyticManager"
import { AnalyticScheduler } from "./Analytic.scheduler"

/**
 * Module for analytic tutor
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    providers: [AnalyticManager, AnalyticScheduler],
    exports: [AnalyticManager, AnalyticScheduler]
})
export class AnalyticModule {

}