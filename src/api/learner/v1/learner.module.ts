import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { LearnerController } from "./learner.controller"
import { LearnerService } from "./learner.service"
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware"
import { RepositoryModule } from "../../../repository/repository.module"

@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [LearnerController],
    providers: [LearnerService]
})
export class LearnerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LearnerAuthenticated)
            .exclude(
                { path: "v1/learner/create", method: RequestMethod.POST }
            )
            .forRoutes(LearnerController)
    }
}