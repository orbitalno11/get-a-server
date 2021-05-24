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
import AnalyticRepository from "./AnalyticRepository"
import FavoriteRepository from "./FavoriteRepository"
import HomeRepository from "./HomeRepository"
import OnlineCourseRepository from "./OnlineCourseRepository"

/**
 * Class for Repository module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule],
    providers: [
        AnalyticRepository,
        MeRepository,
        CoinRepository,
        PaymentRepository,
        UserRepository,
        VerifyRepository,
        TutorRepository,
        ReviewRepository,
        OfflineCourseRepository,
        LearnerRepository,
        FavoriteRepository,
        HomeRepository,
        OnlineCourseRepository
    ],
    exports: [
        AnalyticRepository,
        MeRepository,
        CoinRepository,
        PaymentRepository,
        UserRepository,
        VerifyRepository,
        TutorRepository,
        ReviewRepository,
        OfflineCourseRepository,
        LearnerRepository,
        FavoriteRepository,
        HomeRepository,
        OnlineCourseRepository
    ]
})
export class RepositoryModule {
}