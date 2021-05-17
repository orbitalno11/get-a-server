import { Module } from "@nestjs/common"
import { CoreModule } from "../core/core.module"
import MeRepository from "./MeRepository"
import CoinRepository from "./CoinRepository"
import PaymentRepository from "./PaymentRepository"
import VerifyRepository from "./VerifyRepository"
import TutorRepository from "./TutorRepository"
import UserRepository from "./UserRepository"
import ReviewRepository from "./ReviewRepository"
import OfflineCourseRepository from "./OfflineCourseRepository"
import LearnerRepository from "./LearnerRepository"

/**
 * Class for Repository module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule],
    providers: [
        MeRepository,
        CoinRepository,
        PaymentRepository,
        UserRepository,
        VerifyRepository,
        TutorRepository,
        ReviewRepository,
        OfflineCourseRepository,
        LearnerRepository
    ],
    exports: [
        MeRepository,
        CoinRepository,
        PaymentRepository,
        UserRepository,
        VerifyRepository,
        TutorRepository,
        ReviewRepository,
        OfflineCourseRepository,
        LearnerRepository
    ]
})
export class RepositoryModule {
}