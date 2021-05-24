import AbstractValidator2 from "../AbstractValidator2"
import ValidateResult from "../ValidateResult"
import ClipForm from "../../../model/clip/ClipForm"
import { isEmpty } from "../../../core/extension/CommonExtension"

class ClipFormValidator extends AbstractValidator2<ClipForm> {
    constructor(data: ClipForm) {
        super(data);
    }

    validator(): ValidateResult<any> {
        if (!this.form.courseId?.isSafeNotBlank()) {
            this.errors["courseId"] = "courseId is required"
        }

        if (!this.form.name?.isSafeNotBlank()) {
            this.errors["name"] = "clip name is required"
        }

        if (!this.form.description?.isSafeNotBlank()) {
            this.errors["description"] = "clip name is required"
        }

        if (!this.form.cost?.isBetween(0, 9999999.999)) {
            this.errors["cost"] = "clip cost is invalid"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default ClipFormValidator