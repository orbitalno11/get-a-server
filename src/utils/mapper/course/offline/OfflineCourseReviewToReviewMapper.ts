import {OfflineCourseRatingTransactionEntity} from "../../../../entity/course/offline/offlineCourseRatingTransaction.entity";
import Mapper from "../../../../core/common/Mapper";
import Review from "../../../../model/review/Review"
import { LearnerEntityToSimpleProfile } from "../../learner/LearnerEntityToPublicProfile.mapper"

export class OfflineCourseReviewToReviewMapper implements Mapper<OfflineCourseRatingTransactionEntity, Review> {
    private readonly isOwner: boolean

    constructor(isOwner: boolean = false) {
        this.isOwner = isOwner
    }

    map(from: OfflineCourseRatingTransactionEntity): Review {
        const review = new Review()
        review.id = from.id
        review.rating = from.rating
        review.review = from.review
        review.reviewDate = from.reviewDate
        review.owner = this.isOwner
        review.reviewer = LearnerEntityToSimpleProfile(from.learner)
        return review
    }

    toReviewArray(list: OfflineCourseRatingTransactionEntity[]): Review[] {
        const out: Review[] = []
        list.forEach(data => {
            out.push(this.map(data))
        })
        list.sort((previous, current) => {
            return previous.reviewDate.getTime() - current.reviewDate.getTime()
        })
        return out
    }
}