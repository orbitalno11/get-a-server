import {Module} from "@nestjs/common"
import {CoreModule} from "../core/core.module"
import {UtilityModule} from "../utils/utility.module"
import MeRepository from "./MeRepository"
import CoinRepository from "./CoinRepository"
import PaymentRepository from "./PaymentRepository"
import VerifyRepository from "./VerifyRepository"

/**
 * Class for Repository module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule],
    providers: [MeRepository, CoinRepository, PaymentRepository, VerifyRepository],
    exports: [MeRepository, CoinRepository, PaymentRepository, VerifyRepository]
})
export class RepositoryModule{}