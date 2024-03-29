import validator from "validator"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import LearnerForm from "../../../model/form/register/LearnerForm"
import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"
import { Gender } from "../../../model/common/data/Gender"
import { Grade } from "../../../model/common/data/Grade"

class LearnerRegisterFromValidator extends AbstractValidator<LearnerForm> {

    validator(): ValidateResult<any> {
        const passwordOptions = {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
        }

        if (!this.form.firstname?.isSafeNotBlank()) this.errors["firstname"] = "firstname is required"
        if (!this.form.lastname?.isSafeNotBlank()) this.errors["lastname"] = "lastname is required"
        if (!this.isInGenderList(this.form.gender)) this.errors["gender"] = "gender is required"
        if (!isSafeNotNull(this.form?.dateOfBirth)) this.errors["dateOfBirth"] = "dateOfBirth is required"
        if (this.form.email?.isSafeNotBlank()) {
            if (!validator.isEmail(this.form.email)) this.errors["email"] = "email is in valid"
        } else {
            this.errors["email"] = "email is required"
        }
        if (this.form.password?.isSafeNotBlank()) {
            if (!validator.isStrongPassword(this.form.password, passwordOptions)) this.errors["password"] = "password is not strong"
        } else {
            this.errors["password"] = "password is required"
        }

        if (this.form.confirmPassword?.isSafeNotBlank()) {
            if (!validator.isStrongPassword(this.form.confirmPassword, passwordOptions) && (this.form.password !== this.form.confirmPassword)) this.errors["confirmPassword"] = "confirmPassword is not match with password"
        } else {
            this.errors["confirmPassword"] = "password is required"
        }

        if (this.form.grade?.isPositiveValue()) {
            if (!this.isInGradeList(this.form?.grade)) this.errors["grade"] = "grade is invalid"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private isInGradeList(grade: number): boolean {
        return grade in Grade
    }

    private isInGenderList(gender: number): boolean {
        return gender in Gender
    }
}

export default LearnerRegisterFromValidator