import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { AnalyticModule } from "../../../analytic/Analytic.module"
import { FavoriteService } from "./favorite.service"
import { FavoriteController } from "./favorite.controller"
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware"

/**
 * Module class for favorite api
 * @see FavoriteController
 * @see FavoriteService
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule, AnalyticModule],
    providers: [FavoriteService],
    controllers: [FavoriteController]
})
export class FavoriteModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LearnerAuthenticated)
            .forRoutes(FavoriteController)
    }
}