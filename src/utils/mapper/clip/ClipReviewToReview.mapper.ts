import Mapper from "../../../core/common/Mapper"
import { ClipRatingTransactionEntity } from "../../../entity/course/clip/ClipRatingTransaction.entity"
import Review from "../../../model/review/Review"
import { LearnerEntityToSimpleProfile } from "../learner/LearnerEntityToPublicProfile.mapper"
import { ClipEntityToClipDetailMapper } from "./ClipEntityToClipDetail.mapper"

export class ClipReviewToReviewMapper implements Mapper<ClipRatingTransactionEntity, Review> {

    map(from: ClipRatingTransactionEntity): Review {
        const review = new Review()
        review.id = from.id
        review.rating = from.rating
        review.review = from.review
        review.reviewDate = from.reviewDate
        review.reviewer = LearnerEntityToSimpleProfile(from.learner)
        return review
    }

    mapList(list: ClipRatingTransactionEntity[], ownReview?: ClipRatingTransactionEntity): Review[] {
        return list.map((item) => {
            const review = this.map(item)
            review.owner = item.id === ownReview?.id
            return review
        })
    }

    mapCourseList(list: ClipRatingTransactionEntity[]): Review[] {
        return list.map((item) => {
            const review = this.map(item)
            review.clip = new ClipEntityToClipDetailMapper().map(item.clip)
            return review
        })
    }
}
