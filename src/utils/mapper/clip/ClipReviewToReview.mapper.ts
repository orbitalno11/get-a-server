import Mapper from "../../../core/common/Mapper"
import { ClipRatingTransactionEntity } from "../../../entity/course/clip/ClipRatingTransaction.entity"
import Review from "../../../model/review/Review"
import { LearnerEntityToSimpleProfile } from "../learner/LearnerEntityToPublicProfile.mapper"

export class ClipReviewToReviewMapper implements Mapper<ClipRatingTransactionEntity, Review> {

    constructor(private readonly isOwner: boolean = false) {
    }

    map(from: ClipRatingTransactionEntity): Review {
        const review = new Review()
        review.id = from.id
        review.rating = from.rating
        review.review = from.review
        review.reviewDate = from.reviewDate
        review.owner = this.isOwner
        review.reviewer = LearnerEntityToSimpleProfile(from.learner)
        return review
    }
}