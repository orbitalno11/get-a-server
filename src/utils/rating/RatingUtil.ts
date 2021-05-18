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
}

export default RatingUtil