import { Module } from "@nestjs/common"
import { CoreModule } from "../../core/core.module"
import { UtilityModule } from "../../utils/utility.module"
import { RepositoryModule } from "../../repository/repository.module"
import { DataController } from "./data.controller"
import { DataService } from "./data.service"

/**
 * Class for "_data" api
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [DataController],
    providers: [DataService]
})
export class DataModule {

}