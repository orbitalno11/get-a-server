import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { OfflineCourseController } from "./OfflineCourse.controller"
import { OfflineCourseService } from "./OfflineCourse.service"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"
import LearnerAuthenticated from "../../../middleware/auth/LearnerAuthenticated.middleware"
import { RepositoryModule } from "../../../repository/repository.module"

/**
 * Class for offline course module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [OfflineCourseController],
    providers: [OfflineCourseService]
})
export class OfflineCourseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TutorAuthenticated)
            .forRoutes(
                { path: "v1/offline-course/create", method: RequestMethod.POST },
                { path: "v1/offline-course/:id", method: RequestMethod.PUT },
                { path: "v1/offline-course/:id/accept", method: RequestMethod.GET },
                { path: "v1/offline-course/:id/enroll", method: RequestMethod.GET }
            )
            .apply(LearnerAuthenticated)
            .forRoutes(
                { path: "v1/offline-course/:id/enroll", method: RequestMethod.POST }
            )
    }
}