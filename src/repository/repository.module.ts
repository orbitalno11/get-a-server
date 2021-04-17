import {Module} from "@nestjs/common"
import {CoreModule} from "../core/core.module"
import MeRepository from "./MeRepository"

/**
 * Class for Repository module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule],
    providers: [MeRepository],
    exports: [MeRepository]
})
export class RepositoryModule{}