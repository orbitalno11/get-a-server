import validator from "validator"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import ErrorType from "../../../core/exceptions/model/ErrorType"
import { isEmpty } from "../../../core/extension/CommonExtension"
import LearnerForm from "../../../models/form/register/LearnerForm"
import { logger } from "../../log/logger"
import ValidateResult from "../ValidateResult"

class LearnerRegisterFromValidator {
    private form: LearnerForm
    private errors = {} as any
    private isValid: boolean = false

    constructor(data: LearnerForm) {
        this.form = data
    }

    validate(): ValidateResult<any> {
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
        if (isEmpty(this.form.dateOfBirth)) this.errors['dateOfBirth'] = "dateOfBirth is required"
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

        if (isEmpty(this.form.grade)) {
            this.errors['grade'] = "grade is required"
        } else {
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