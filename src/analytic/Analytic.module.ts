import { Module } from "@nestjs/common"
import { CoreModule } from "../core/core.module"
import { UtilityModule } from "../utils/utility.module"
import { RepositoryModule } from "../repository/repository.module"
import AnalyticManager from "./AnalyticManager"

@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    providers: [AnalyticManager],
    exports: [AnalyticManager]
})
export class AnalyticModule {

}