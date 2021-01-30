import validator from "validator"
import { isEmpty } from "../../../core/extension/CommonExtension"
import LearnerForm from "../../../models/form/register/LearnerForm"
import ValidateResult from "../ValidateResult"

class LearnerRegisterFromValidator {
    private form: LearnerForm
    private errors = {} as any
    private isValid: boolean = false

    constructor(data: LearnerForm) {
        this.form = data
    }

    validate(): ValidateResult<any> {
        if (isEmpty(this.form.firstname)) this.errors['firstname'] = "firstname is required"
        if (isEmpty(this.form.lastname)) this.errors['lastname'] = "lastname is required"
        if (isEmpty(this.form.gender)) this.errors['gender'] = "gender is required"
        if (isEmpty(this.form.dateOfBirth)) this.errors['dateOfBirth'] = "dateOfBirth is required"
        if (!validator.isEmail(this.form.email)) this.errors['email'] = "email is required"
        if (isEmpty(this.form.password)) this.errors['password'] = "password is required"
        if (isEmpty(this.form.confirmPassword)) this.errors['confirmPassword'] = "password is required"
        if (!validator.isStrongPassword(this.form.password)) this.errors['password'] = "password is not strong"
        if (!validator.isStrongPassword(this.form.confirmPassword) && (this.form.password === this.form.confirmPassword)) this.errors['confirmPassword'] = "confirmPassword is not match with password"
        if (!validator.isNumeric(this.form.grade.toString())) this.errors['grade'] = "grade is required"

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default LearnerRegisterFromValidator