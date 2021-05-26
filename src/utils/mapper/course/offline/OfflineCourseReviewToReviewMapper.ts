import { OfflineCourseRatingTransactionEntity } from "../../../../entity/course/offline/offlineCourseRatingTransaction.entity"
import Mapper from "../../../../core/common/Mapper"
import Review from "../../../../model/review/Review"
import { LearnerEntityToSimpleProfile } from "../../learner/LearnerEntityToPublicProfile.mapper"

export class OfflineCourseReviewToReviewMapper implements Mapper<OfflineCourseRatingTransactionEntity, Review> {

    map(from: OfflineCourseRatingTransactionEntity): Review {
        const review = new Review()
        review.id = from.id
        review.rating = from.rating
        review.review = from.review
        review.reviewDate = from.reviewDate
        review.reviewer = LearnerEntityToSimpleProfile(from.learner)
        return review
    }

    mapList(list: OfflineCourseRatingTransactionEntity[], ownReview?: OfflineCourseRatingTransactionEntity): Review[] {
        return list.map((item) => {
            const review = this.map(item)
            review.owner = item.id === ownReview?.id
            return review
        })
    }
}