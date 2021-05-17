import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { UtilityModule } from "../../../utils/utility.module"
import { ReviewController } from "./review.controller"
import { ReviewService } from "./review.service"
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware"
import AuthenticatedRequest from "../../../middleware/auth/AuthenticatedRequest.middleware"
import { AnalyticModule } from "../../../analytic/Analytic.module"

/**
 * Class for review module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, RepositoryModule, UtilityModule, AnalyticModule],
    controllers: [ReviewController],
    providers: [ReviewService]
})
export class ReviewModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LearnerAuthenticated)
            .exclude(
                { path: "v1/review/course/:id", method: RequestMethod.GET },
                { path: "v1/review/user/:userId/course/:courseId", method: RequestMethod.GET }
            )
            .forRoutes(ReviewController)
            .apply(AuthenticatedRequest)
            .forRoutes(
                { path: "v1/review/course/:id", method: RequestMethod.GET }
            )
    }
}