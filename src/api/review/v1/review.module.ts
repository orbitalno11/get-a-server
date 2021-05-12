import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { UtilityModule } from "../../../utils/utility.module"
import { ReviewController } from "./review.controller"
import { ReviewService } from "./review.service"
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware"

/**
 * Class for review module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, RepositoryModule, UtilityModule],
    controllers: [ReviewController],
    providers: [ReviewService]
})
export class ReviewModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LearnerAuthenticated)
            .forRoutes(ReviewController)
    }
}