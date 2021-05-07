import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { TutorController } from "./tutor.controller"
import { TutorService } from "./tutor.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"
import { RepositoryModule } from "../../../repository/repository.module"
import AuthenticatedRequest from "../../../middleware/auth/AuthenticatedRequest.middleware"

@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [TutorController],
    providers: [TutorService]
})
export class TutorModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TutorAuthenticated)
            .exclude(
                { path: "v1/tutor/create", method: RequestMethod.POST },
                { path: "v1/tutor/:id", method: RequestMethod.GET },
                { path: "v1/tutor/:id/educations", method: RequestMethod.GET}
            )
            .forRoutes(TutorController)
            .apply(AuthenticatedRequest)
            .forRoutes(
                { path: "v1/tutor/:id/educations", method: RequestMethod.GET}
            )
    }
}
