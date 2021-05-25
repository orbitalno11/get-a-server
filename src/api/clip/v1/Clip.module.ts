import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { ClipController } from "./Clip.controller"
import { ClipService } from "./Clip.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"

/**
 * Module class for "v1/clip" controller
 * @see ClipController
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [ClipController],
    providers: [ClipService]
})
export class ClipModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TutorAuthenticated)
            .forRoutes(ClipController)
    }
}