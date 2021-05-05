import AbstractValidator from "../AbstractValidator"
import TestingVerifyForm from "../../../model/education/TestingVerifyForm"
import ValidateResult from "../ValidateResult"
import { isEmpty } from "../../../core/extension/CommonExtension"

/**
 * Validator class for TestingVerify form
 * @author orbitalno11 2021 A.D.
 */
class TestingVerifyFormValidator extends AbstractValidator<TestingVerifyForm> {
    validator(): ValidateResult<any> {
        if (!this.form.examId?.isSafeNumber()) {
            this.errors["examId"] = "Testing examId is invalid."
        }

        if (!this.form.subjectCode?.isSafeNotBlank()) {
            this.errors["subjectId"] = "Testing subjectId is invalid."
        }

        if (!this.form.score?.isPositiveValue()) {
            this.errors["score"] = "Testing score is invalid."
        }

        if (this.form.year?.isPositiveValue()) {
            if (!this.isValidYear(this.form.year)) {
                this.errors["testingYear"] = "Testing year is invalid."
            }
        } else {
            this.errors["testingYear"] = "Testing year is required."
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    /**
     * Check testing year is valid
     * @param year
     * @private
     */
    private isValidYear(year: number): boolean {
        return year <= (new Date().getFullYear())
    }

}

export default TestingVerifyFormValidator