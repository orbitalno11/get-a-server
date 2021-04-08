import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common"
import {CoreModule} from "../../../core/core.module"
import {UtilityModule} from "../../../utils/utility.module"
import {OfflineCourseController} from "./OfflineCourse.controller"
import {OfflineCourseService} from "./OfflineCourse.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"

@Module({
    imports: [CoreModule, UtilityModule],
    controllers: [OfflineCourseController],
    providers: [OfflineCourseService]
})
export class OfflineCourseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TutorAuthenticated)
            .forRoutes(
                {path: "v1/offline-course/create", method: RequestMethod.POST}
            )
            // .apply(AuthenticatedRequest)
            // .forRoutes(
            //     {path: "v1/offline-course/:id", method: RequestMethod.GET}
            // )
    }
}