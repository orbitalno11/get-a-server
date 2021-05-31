import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../../../repository/AnalyticRepository"
import AnalyticManager from "../../../analytic/AnalyticManager"
import User from "../../../model/User"
import { launchAnalytic } from "../../../core/common/launch"
import { UserRole } from "../../../core/constant/UserRole"
import TutorProfile from "../../../model/profile/TutorProfile"
import { CourseType } from "../../../model/course/data/CourseType"

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

    /**
     * Track tutor profile view
     * @param userId
     */
    trackProfileView(userId: string) {
        launchAnalytic(async () => {
            await this.analytic.trackProfileView(TutorProfile.getTutorId(userId))
        })
    }

    /**
     * Track tutor course view
     * @param courseId
     * @param courseType
     */
    trackImpressCourse(courseId: string, courseType: CourseType) {
        launchAnalytic(async () => {
            await this.analytic.trackImpressCourse(courseId, courseType)
        })
    }

    /**
     * Track impress clip
     * @param clipId
     */
    trackImpressClip(clipId: string) {
        launchAnalytic(async () => {
            await this.analytic.trackImpressClip(clipId)
        })
    }
}