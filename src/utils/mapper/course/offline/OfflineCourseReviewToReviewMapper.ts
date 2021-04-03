import {OfflineCourseRatingTransactionEntity} from "../../../../entity/course/offline/offlineCourseRatingTransaction.entity";
import Mapper from "../../../../core/common/Mapper";

export class OfflineCourseReviewToReviewMapper implements Mapper<OfflineCourseRatingTransactionEntity, Review> {
    map(from: OfflineCourseRatingTransactionEntity): Review {
        const review = new Review()
        review.rating = from.rating
        review.review = from.review
        review.reviewDate = from.reviewDate
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