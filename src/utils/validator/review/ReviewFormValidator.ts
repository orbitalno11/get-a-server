import AbstractValidator from "../AbstractValidator"
import ReviewForm from "../../../model/review/ReviewForm"
import ValidateResult from "../ValidateResult"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { CourseType } from "../../../model/course/data/CourseType"

/**
 * Validator class for review form
 * @author orbitalno11 2021 A.D.
 */
class ReviewFormValidator extends AbstractValidator<ReviewForm>{
    validator(): ValidateResult<any> {
        if (!this.form.courseId?.isSafeNotBlank()) {
            this.errors["id"] = "id is invalid"
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

        if (!(typeof this.form.isClip === "boolean")) {
            this.errors["isClip"] = "value is invalid"
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