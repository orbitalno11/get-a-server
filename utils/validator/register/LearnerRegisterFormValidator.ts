import validator from "validator"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import LearnerForm from "../../../models/register/LearnerForm"
import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"

class LearnerRegisterFromValidator extends AbstractValidator<LearnerForm> {

    constructor(data: LearnerForm) {
        super(data)
    }

    validator(): ValidateResult<any> {
        const passwordOptions = {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
        }

        if (isEmpty(this.form.firstname)) this.errors['firstname'] = "firstname is required"
        if (isEmpty(this.form.lastname)) this.errors['lastname'] = "lastname is required"
        if (isEmpty(this.form.gender)) this.errors['gender'] = "gender is required"
        if (!isSafeNotNull(this.form.dateOfBirth)) this.errors['dateOfBirth'] = "dateOfBirth is required"
        if (!isEmpty(this.form.email)) {
            if (!validator.isEmail(this.form.email)) this.errors['email'] = "email is in valid"
        } else {
            this.errors['email'] = "email is required"
        }
        if (isEmpty(this.form.password)) {
            this.errors['password'] = "password is required"
        } else {
            if (!validator.isStrongPassword(this.form.password, passwordOptions)) this.errors['password'] = "password is not strong"
        }

        if (isEmpty(this.form.confirmPassword)) {
            this.errors['confirmPassword'] = "password is required"
        } else {
            if (!validator.isStrongPassword(this.form.confirmPassword, passwordOptions) && (this.form.password !== this.form.confirmPassword)) this.errors['confirmPassword'] = "confirmPassword is not match with password"
        }

        if (this.form.grade.isSafeNumber()) {
            if (!validator.isNumeric(this.form.grade.toString())) this.errors['grade'] = "grade is invalid"
        }
        
        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default LearnerRegisterFromValidator