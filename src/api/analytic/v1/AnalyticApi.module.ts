import { Module } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { AnalyticApiService } from "./AnalyticApi.service"
import { AnalyticApiController } from "./AnalyticApi.controller"

/**
 * Module for "v1/analytic" API
 * @see AnalyticApiController
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    providers: [AnalyticApiService],
    controllers: [AnalyticApiController]
})
export class AnalyticApiModule {

}