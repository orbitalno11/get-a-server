import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common"
import {CoreModule} from "../../../core/core.module"
import {UtilityModule} from "../../../utils/utility.module"
import {LearnerController} from "./learner.controller"
import {LearnerService} from "./learner.service"
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware";

@Module({
    imports: [CoreModule, UtilityModule],
    controllers: [LearnerController],
    providers: [LearnerService]
})
export class LearnerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LearnerAuthenticated)
            .exclude("v1/learner/create")
            .forRoutes(
                {path: "v1/learner/:id", method: RequestMethod.ALL}
            )
    }
}