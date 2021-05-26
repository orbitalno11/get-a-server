import ReviewForm from "../../../model/review/ReviewForm"
import ValidateResult from "../ValidateResult"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { CourseType } from "../../../model/course/data/CourseType"
import AbstractValidator2 from "../AbstractValidator2"

/**
 * Validator class for review form
 * @author orbitalno11 2021 A.D.
 */
class ReviewFormValidator extends AbstractValidator2<ReviewForm>{
    constructor(data: ReviewForm) {
        super(data);
    }

    validator(): ValidateResult<any> {
        if (!this.form.courseId?.isSafeNotBlank()) {
            this.errors["courseId"] = "course id is invalid"
        }

        if (!(typeof this.form.isClip === "boolean")) {
            this.errors["isClip"] = "value is invalid"
        }

        if (this.form.isClip) {
            if (!this.form.clipId?.isSafeNotBlank()) {
                this.errors["clipId"] = "clip id is invalid"
            }
        }

        if (!this.form.comment?.isSafeNotBlank()) {
            this.errors["comment"] = "comment is invalid"
        }

        if (this.form.rating?.isSafeNumber()) {
            if (!this.form.rating?.isBetween(1, 5)) {
                this.errors["rating"] = "rating is invalid"
            }
        } else {
            this.errors["rating"] = "rating is required"
        }

        if (!(this.form.courseType in CourseType)) {
            this.errors["isOfflineCourse"] = "value is invalid"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default ReviewFormValidator