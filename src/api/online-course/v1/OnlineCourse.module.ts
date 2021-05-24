import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { OnlineCourseService } from "./OnlineCourse.service"
import { OnlineCourseController } from "./OnlineCourse.controller"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"
import { AnalyticModule } from "../../../analytic/Analytic.module"

@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule, AnalyticModule],
    providers: [OnlineCourseService],
    controllers: [OnlineCourseController]
})
export class OnlineCourseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TutorAuthenticated)
            .exclude(
                { path: "v1/online-course/:id", method: RequestMethod.GET }
            )
            .forRoutes(OnlineCourseController)
    }
}