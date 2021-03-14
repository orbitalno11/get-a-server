import validator from "validator"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import TutorUpdateFormModel from "../../../models/tutor/data/TutorUpdateFormModel"
import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"

class TutorUpdateFormValidator extends AbstractValidator<TutorUpdateFormModel> {

    validator(): ValidateResult<any> {
        if (isEmpty(this.form?.firstname)) this.errors['firstname'] = "firstname is required"
        if (isEmpty(this.form?.lastname)) this.errors['lastname'] = "lastname is required"
        if (isEmpty(this.form?.gender)) this.errors['gender'] = "gender is required"
        if (!isSafeNotNull(this.form?.dateOfBirth)) this.errors['dateOfBirth'] = "dateOfBirth is required"
        if (this.form?.email?.isNotSafeNull()) {
            if (!validator.isEmail(this.form.email)) this.errors['email'] = "email is in valid"
        } else {
            this.errors['email'] = "email is required"
        }

        if (this.form?.phoneNumber.isSafeNotNull()) {
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