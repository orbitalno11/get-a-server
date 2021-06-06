import { Injectable } from "@nestjs/common"
import FavoriteRepository from "../../../repository/FavoriteRepository"
import AnalyticManager from "../../../analytic/AnalyticManager"
import { launch } from "../../../core/common/launch"
import UserUtil from "../../../utils/UserUtil"
import TutorProfile from "../../../model/profile/TutorProfile"
import User from "../../../model/User"
import TutorCard from "../../../model/profile/TutorCard"
import LearnerProfile from "../../../model/profile/LearnerProfile"
import { FavoriteTutorEntityToTutorCardListMapper } from "../../../utils/mapper/tutor/FavoriteTutorEntityToTutorCard.mapper"
import { isNotEmpty } from "../../../core/extension/CommonExtension"

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
     * Like action
     * @param tutorUserId
     * @param learnerUserId
     */
    likedAction(tutorUserId: string, learnerUserId: string) {
        return launch(async () => {
            const liked = await this.userUtils.isLiked(learnerUserId, tutorUserId)

            const learnerId = LearnerProfile.getLearnerId(learnerUserId)
            const tutorId = TutorProfile.getTutorId(tutorUserId)

            if (liked) {
                await this.repository.unLikeTutor(tutorId, learnerId)
                this.analytic.decreaseNumberOfFavorite(TutorProfile.getTutorId(tutorUserId))
            } else {
                await this.repository.likeTutor(tutorId, learnerId)
                this.analytic.increaseNumberOfFavorite(TutorProfile.getTutorId(tutorUserId))
            }
        })
    }

    /**
     * Get favorite tutor list
     * @param user
     */
    getFavoriteTutorList(user: User): Promise<TutorCard[]> {
        return launch(async () => {
            const tutorList = await this.repository.getFavoriteTutorList(LearnerProfile.getLearnerId(user.id))
            return isNotEmpty(tutorList) ? new FavoriteTutorEntityToTutorCardListMapper().map(tutorList) : []
        })
    }

    /**
     * Check already like tutor
     * @param learnerUserId
     * @param tutorUserId
     */
    isLiked(learnerUserId: string, tutorUserId: string): Promise<boolean> {
        return launch(async () => {
            return await this.userUtils.isLiked(learnerUserId, tutorUserId)
        })
    }
}