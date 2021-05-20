import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { OnlineCourseService } from "./OnlineCourse.service"
import { OnlineCourseController } from "./OnlineCourse.controller"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"

@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    providers: [OnlineCourseService],
    controllers: [OnlineCourseController]
})
export class OnlineCourseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TutorAuthenticated)
            .forRoutes(OnlineCourseController)
    }
}