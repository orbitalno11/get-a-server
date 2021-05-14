import { Injectable } from "@nestjs/common"
import FavoriteRepository from "../../../repository/FavoriteRepository"
import AnalyticManager from "../../../analytic/AnalyticManager"
import { launch } from "../../../core/common/launch"
import UserUtil from "../../../utils/UserUtil"
import TutorProfile from "../../../model/profile/TutorProfile"

/**
 * Service Class for "v1/favorite"
 * @see FavoriteController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class FavoriteService {
    constructor(
        private readonly repository: FavoriteRepository,
        private readonly analytic: AnalyticManager,
        private readonly userUtils: UserUtil
    ) {
    }

    /**
     * Like tutor by tutor id
     * @param tutorUserId
     * @param learnerUserId
     */
    likeTutor(tutorUserId: string, learnerUserId: string) {
        return launch(async () => {
            const tutor = await this.userUtils.getTutor(tutorUserId)
            const learner = await this.userUtils.getLearner(learnerUserId)

            await this.repository.likeTutor(tutor, learner)

            await this.analytic.increaseNumberOfFavorite(TutorProfile.getTutorId(tutorUserId))
        })
    }

    /**
     * Unlike tutor by tutor id
     * @param tutorUserId
     * @param learnerUserId
     */
    unLikeTutor(tutorUserId: string, learnerUserId: string) {
        return launch(async () => {
            const tutor = await this.userUtils.getTutor(tutorUserId)
            const learner = await this.userUtils.getLearner(learnerUserId)

            await this.repository.unLikeTutor(tutor, learner)

            await this.analytic.decreaseNumberOfFavorite(TutorProfile.getTutorId(tutorUserId))
        })
    }
}