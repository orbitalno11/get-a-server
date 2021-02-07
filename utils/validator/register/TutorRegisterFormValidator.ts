import validator from "validator"
import { isEmpty, isNotEmpty } from "../../../core/extension/CommonExtension"
import TutorForm from "../../../models/register/TutorForm"
import ValidateResult from "../ValidateResult"

class TutorRegisterFormValidator {
    private form: TutorForm
    private errors = {} as any
    private isValid: boolean = false

    constructor(data: TutorForm) {
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

        if (isEmpty(this.form.subject1)) {
            this.errors["subject1"] = "subject1 is required"
        } else {
            if (!validator.isNumeric(this.form.subject1.toString())) this.errors["subject1"] = "subject1 is invalid"
        }

        
        if (isNotEmpty(this.form.subject2)) {
            if (this.form.subject2 != null) {
                if (!validator.isNumeric(this.form.subject2.toString())) this.errors["subject2"] = "subject2 is invalid"
            }
        }

        if (isNotEmpty(this.form.subject3)) {
            if (this.form.subject3 != null) {
                if (!validator.isNumeric(this.form.subject3.toString())) this.errors["subject3"] = "subject3 is invalid"
            }
        }
        
        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default TutorRegisterFormValidator