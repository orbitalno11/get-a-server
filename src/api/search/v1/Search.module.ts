import { Module } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { RepositoryModule } from "../../../repository/repository.module"
import { SearchController } from "./Search.controller"
import { SearchService } from "./Search.service"

/**
 * Search module for "v1/search"
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [SearchController],
    providers: [SearchService]
})
export class SearchModule {

}