import validator from "validator"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import TutorUpdateFormModel from "../../../models/tutor/data/TutorUpdateFormModel"
import TutorUpdateForm from "../../../models/tutor/TutorUpdateForm"
import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"

class TutorUpdateFormValidator extends AbstractValidator<TutorUpdateFormModel> {
    constructor(data: TutorUpdateForm) {
        super(data)
    }

    validator(): ValidateResult<any> {
        if (isEmpty(this.form.firstname)) this.errors['firstname'] = "firstname is required"
        if (isEmpty(this.form.lastname)) this.errors['lastname'] = "lastname is required"
        if (isEmpty(this.form.gender)) this.errors['gender'] = "gender is required"
        if (!isSafeNotNull(this.form.dateOfBirth)) this.errors['dateOfBirth'] = "dateOfBirth is required"
        if (!isEmpty(this.form.email)) {
            if (!validator.isEmail(this.form.email)) this.errors['email'] = "email is in valid"
        } else {
            this.errors['email'] = "email is required"
        }

        if (!isEmpty(this.form.phoneNumber)) {
            if (!validator.isMobilePhone(this.form.phoneNumber, "th-TH")) this.errors["phoneNumber"] = "phone number is invalid"
        }
        
        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }
}

export default TutorUpdateFormValidator