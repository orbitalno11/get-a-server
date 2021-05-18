import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { AnalyticApiService } from "./AnalyticApi.service"
import { AnalyticApiController } from "./AnalyticApi.controller"
import AuthenticatedRequest from "../../../middleware/auth/AuthenticatedRequest.middleware"
import { AnalyticModule } from "../../../analytic/Analytic.module"

/**
 * Module for "v1/analytic" API
 * @see AnalyticApiController
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule, AnalyticModule],
    providers: [AnalyticApiService],
    controllers: [AnalyticApiController]
})
export class AnalyticApiModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticatedRequest)
            .forRoutes(AnalyticApiController)
    }
}