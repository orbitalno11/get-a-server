import { CourseType } from "../course/data/CourseType"

class ReviewForm {
    courseId: string
    reviewId: number | null
    rating: number
    comment: string
    isClip: boolean
    courseType: CourseType

    // static method
    public static createFromBody(body: ReviewForm): ReviewForm {
        const form = new ReviewForm()
        form.courseId = body.courseId
        form.reviewId = body.reviewId ? Number(body.reviewId) : null
        form.rating = Number(body.rating)
        form.comment = body.comment
        form.isClip = body.isClip
        form.courseType = Number(body.courseType)
        return form
    }
}

export default ReviewForm