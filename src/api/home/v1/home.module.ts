import { Module } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { HomeService } from "./home.service"
import { HomeController } from "./home.controller"

/**
 * Module class for "v1/home"
 * @see HomeController
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    providers: [HomeService],
    controllers: [HomeController]
})
export class HomeModule {

}