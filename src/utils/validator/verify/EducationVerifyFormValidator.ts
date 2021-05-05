import AbstractValidator from "../AbstractValidator"
import EducationVerifyForm from "../../../model/education/EducationVerifyForm"
import ValidateResult from "../ValidateResult"
import { Grade } from "../../../model/common/data/Grade"
import { EducationStatus } from "../../../model/education/data/EducationStatus.enum"
import { isEmpty } from "../../../core/extension/CommonExtension"

/**
 * Validation class for education verify request
 * @author orbitalno11 2021 A.D.
 */
class EducationVerifyFormValidator extends AbstractValidator<EducationVerifyForm> {
    validator(): ValidateResult<any> {
        if (!(this.form.grade in Grade)) {
            this.errors["grade"] = "Education grade is invalid"
        }

        if (!this.form.branch?.isSafeNumber()) {
            this.errors["branch"] = "Education branch is invalid"
        }

        if (!this.form.institute?.isSafeNumber()) {
            this.errors["institute"] = "Education institute is invalid"
        }

        if (!(this.isEducationStatus(this.form.status))) {
            this.errors["status"] = "Education status is invalid"
        }

        if (this.form.gpax?.isSafeNumber()) {
            if (!(this.form.gpax >= 0.00 && this.form.gpax <= 4.00)) {
                this.errors["gpax"] = "Education gpax is invalid"
            }
        } else {
            this.errors["gpax"] = "Education gpax is required"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private isEducationStatus(status: string): boolean {
        return status === EducationStatus.GRADUATED || status === EducationStatus.STUDYING
    }
}

export default EducationVerifyFormValidator