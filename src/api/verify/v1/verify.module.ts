import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { TutorVerifyController } from "./tutor_verify_controller"
import { VerifyService } from "./verify.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"

/**
 * Module class for "v1/verify"
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [TutorVerifyController],
    providers: [VerifyService]
})
export class VerifyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TutorAuthenticated)
            .forRoutes(TutorVerifyController)
    }
}