import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { VerifyController } from "./verify.controller"
import { VerifyService } from "./verify.service"
import AdminAuthenticated from "../../../middleware/auth/AdminAuthenticated.middleware"

/**
 * Module class for "v1/verify"
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [VerifyController],
    providers: [VerifyService]
})
export class VerifyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AdminAuthenticated)
            .forRoutes(VerifyController)
    }
}