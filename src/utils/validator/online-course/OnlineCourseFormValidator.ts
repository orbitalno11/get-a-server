import OnlineCourseForm from "../../../model/course/OnlineCourseForm"
import ValidateResult from "../ValidateResult"
import { Grade } from "../../../model/common/data/Grade"
import { Subject } from "../../../model/common/data/Subject"
import { isEmpty } from "../../../core/extension/CommonExtension"
import AbstractValidator2 from "../AbstractValidator2"

class OnlineCourseFormValidator extends AbstractValidator2<OnlineCourseForm> {

    constructor(data: OnlineCourseForm) {
        super(data);
    }

    validator(): ValidateResult<any> {
        if (!this.form.name?.isSafeNotBlank()) {
            this.errors["name"] = "course name is required"
        }

        if (this.form.grade?.isSafeNumber()) {
            if (!(this.form.grade in Grade)) {
                this.errors["grade"] = "course grade is invalid"
            }
        } else {
            this.errors["grade"] = "course grade is required"
        }

        if (this.form.subject?.isSafeNotBlank()) {
            if (!(this.form?.subject in Subject)) {
                this.errors["form"] = "course subject is invalid"
            }
        } else {
            this.errors["form"] = "course subject is required"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default OnlineCourseFormValidator