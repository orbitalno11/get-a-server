import {Module} from "@nestjs/common"
import {CoreModule} from "../core/core.module"
import MeRepository from "./MeRepository"
import {UtilityModule} from "../utils/utility.module"

/**
 * Class for Repository module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule],
    providers: [MeRepository],
    exports: [MeRepository]
})
export class RepositoryModule{}