import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common"
import {CoreModule} from "../../../core/core.module"
import {UtilityModule} from "../../../utils/utility.module"
import {TutorController} from "./tutor.controller"
import {TutorService} from "./tutor.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"

@Module({
    imports: [CoreModule, UtilityModule],
    controllers: [TutorController],
    providers: [TutorService],
})
export class TutorModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TutorAuthenticated)
            .exclude("v1/tutor/create")
            .forRoutes(
                {path: "v1/tutor/:id", method: RequestMethod.ALL},
            )
    }
}
