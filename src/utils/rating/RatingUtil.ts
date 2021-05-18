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
}

export default RatingUtil