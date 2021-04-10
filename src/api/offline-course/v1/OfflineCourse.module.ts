import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common"
import {CoreModule} from "../../../core/core.module"
import {UtilityModule} from "../../../utils/utility.module"
import {OfflineCourseController} from "./OfflineCourse.controller"
import {OfflineCourseService} from "./OfflineCourse.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"
import AuthenticatedRequest from "../../../middleware/auth/AuthenticatedRequest.middleware";
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware";

@Module({
    imports: [CoreModule, UtilityModule],
    controllers: [OfflineCourseController],
    providers: [OfflineCourseService]
})
export class OfflineCourseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticatedRequest)
            .forRoutes(
                {path: "v1/offline-course/:id", method: RequestMethod.GET}
            )
            .apply(TutorAuthenticated)
            .forRoutes(
                {path: "v1/offline-course/create", method: RequestMethod.POST},
                {path: "v1/offline-course/:id", method: RequestMethod.PUT},
                {path: "v1/offline-course/:id/accept", method: RequestMethod.GET}
            )
            .apply(LearnerAuthenticated)
            .forRoutes(
                {path: "v1/offline-course/:id/enroll", method: RequestMethod.GET}
            )
    }
}