import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../../../repository/AnalyticRepository"
import AnalyticManager from "../../../analytic/AnalyticManager"
import User from "../../../model/User"
import { launchAnalytic } from "../../../core/common/launch"
import { UserRole } from "../../../core/constant/UserRole"
import TutorProfile from "../../../model/profile/TutorProfile"

/**
 * Service class for analytic api
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class AnalyticApiService {
    constructor(
        private readonly repository: AnalyticRepository,
        private readonly analytic: AnalyticManager
    ) {
    }

    /**
     * Track tutor login
     * @param user
     */
    trackLogin(user: User) {
        launchAnalytic(async () => {
            if (user.role === UserRole.TUTOR) {
                await this.analytic.trackLogin(TutorProfile.getTutorId(user.id))
            }
        })
    }
}