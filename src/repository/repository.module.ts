import {Module} from "@nestjs/common"
import {CoreModule} from "../core/core.module"
import MeRepository from "./MeRepository"
import CoinRepository from "./CoinRepository"
import PaymentRepository from "./PaymentRepository"
import VerifyRepository from "./VerifyRepository"
import TutorRepository from "./TutorRepository"
import { UserRepository } from "./UserRepository"

/**
 * Class for Repository module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule],
    providers: [MeRepository, CoinRepository, PaymentRepository, UserRepository, VerifyRepository, TutorRepository],
    exports: [MeRepository, CoinRepository, PaymentRepository, UserRepository, VerifyRepository, TutorRepository]
})
export class RepositoryModule{}