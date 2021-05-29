/**
 * Utility for rating
 * @author orbitalno11 2021 A.D.
 */
class RatingUtil {

    /**
     * Calculate rating average rating by add new value
     * @param avgRating
     * @param newRating
     * @param reviewNumber
     */
    public static calculateIncreaseRatingAvg(
        avgRating: number,
        newRating: number,
        reviewNumber: number
    ): number {
        return ((avgRating * reviewNumber) + newRating) / (reviewNumber + 1)
    }

    /**
     * Calculate rating average rating by remove value
     * @param avgRating
     * @param removeRating
     * @param reviewNumber
     */
    public static calculateDecreaseRatingAvg(
        avgRating: number,
        removeRating: number,
        reviewNumber: number
    ): number {
        const number = reviewNumber > 1 ? (reviewNumber - 1) : 1
        return ((avgRating * reviewNumber) - removeRating) / (number)
    }

    /**
     * Calculate updating rating average
     * @param avgRating
     * @param newRating
     * @param oldRating
     * @param reviewNumber
     */
    public static calculateUpdateRatingAvg(
        avgRating: number,
        newRating: number,
        oldRating: number,
        reviewNumber: number
    ): number {
        const decreaseRating = this.calculateDecreaseRatingAvg(avgRating, oldRating, reviewNumber)
        const decreaseReviewNumber = reviewNumber - 1
        return this.calculateIncreaseRatingAvg(decreaseRating, newRating, decreaseReviewNumber)
    }

    /**
     * Calculate tutor rating average from all type of course
     * @param offlineCourseRating
     * @param onlineCourseRating
     * @param numberOfOfflineReview
     * @param numberOfOnlineReview
     */
    public static calculateTutorRatingAvg(
        offlineCourseRating: number,
        onlineCourseRating: number,
        numberOfOfflineReview: number,
        numberOfOnlineReview: number
    ) {
        const offline = offlineCourseRating * numberOfOfflineReview
        const online = onlineCourseRating * numberOfOnlineReview
        const numberOfReview = numberOfOfflineReview + numberOfOnlineReview
        return (offline + online) / numberOfReview
    }

    /**
     * Calculate average scoring
     * This function calculate at rating in range 0 to 10
     * https://math.stackexchange.com/a/942965
     * @param p
     * @param q
     * @param P
     * @param M
     */
    public static avgRateScoring(p: number, q: number, P: number = 0.5, M: number = 15): number {
        const Q = 1.44 * M
        return (P * p) + (10 * (1 - P) * (1 - Math.pow(Math.E, -q / Q)))
    }
}

export default RatingUtil