import { Module } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { OnlineCourseService } from "./OnlineCourse.service"
import { OnlineCourseController } from "./OnlineCourse.controller"

@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    providers: [OnlineCourseService],
    controllers: [OnlineCourseController]
})
export class OnlineCourseModule {

}