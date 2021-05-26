import { CourseType } from "../course/data/CourseType"
import { ApiProperty } from "@nestjs/swagger"

class ReviewForm {
    @ApiProperty() courseId: string | null
    @ApiProperty() reviewId: number | null
    @ApiProperty() clipId: string | null
    @ApiProperty() rating: number
    @ApiProperty() comment: string
    @ApiProperty() isClip: boolean
    @ApiProperty({ enum: [CourseType] }) courseType: CourseType

    // static method
    public static createFromBody(body: ReviewForm): ReviewForm {
        const form = new ReviewForm()
        form.courseId = body.courseId
        form.clipId = body.clipId
        form.reviewId = body.reviewId ? Number(body.reviewId) : null
        form.rating = Number(body.rating)
        form.comment = body.comment
        form.isClip = body.isClip
        form.courseType = Number(body.courseType)
        return form
    }
}

export default ReviewForm