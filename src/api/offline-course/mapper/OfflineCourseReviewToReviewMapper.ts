import {OfflineCourseRatingTransactionEntity} from "../../../entity/course/offline/offlineCourseRatingTransaction.entity";

export const OfflineCourseReviewToReviewMapper = (from: OfflineCourseRatingTransactionEntity): Review => {
    const review = new Review()
    review.rating = from.rating
    review.review = from.review
    review.reviewDate = from.reviewDate
    return review
}