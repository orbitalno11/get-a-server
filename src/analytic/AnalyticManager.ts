import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../repository/AnalyticRepository"
import { launch } from "../core/common/launch"

/**
 * Analytic manager
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class AnalyticManager {
    constructor(private readonly repository: AnalyticRepository) {
    }

    /**
     * Increase number of learner favorite
     * @param tutorId
     */
    increaseNumberOfFavorite(tutorId: string) {
        return launch(async () => {
            await this.repository.increaseStatisticNumberOfFavorite(tutorId)
            await this.repository.increaseMonetaryNumberOfFavorite(tutorId)
        })
    }

    /**
     * Decrease number of learner favorite
     * @param tutorId
     */
    decreaseNumberOfFavorite(tutorId: string) {
        return launch(async () => {
            await this.repository.decreaseStatisticNumberOfFavorite(tutorId)
            await this.repository.decreaseMonetaryNumberOfFavorite(tutorId)
        })
    }

    /**
     * Track tutor login
     * @param tutorId
     */
    trackLogin(tutorId: string) {
        return launch(async () => {
            await this.repository.trackLogin(tutorId)
        })
    }

    /**
     * Track tutor profile view
     * @param tutorId
     */
    trackProfileView(tutorId: string) {
        return launch(async () => {
            await this.repository.trackProfileView(tutorId)
        })
    }

    /**
     * Track tutor course view
     * @param tutorId
     */
    trackTutorCourseView(tutorId: string) {
        return launch(async () => {
            await this.repository.trackTutorCourseView(tutorId)
        })
    }

    /**
     * Track tutor approve learner to course
     * @param tutorId
     */
    trackTutorApproved(tutorId: string) {
        return launch(async () => {
            await this.repository.trackTutorApproved(tutorId)
        })
    }
}

export default AnalyticManager