import validator from "validator"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import TutorUpdateForm from "../../../model/form/update/TutorUpdateForm"
import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"
import { Gender } from "../../../model/common/Gender"

class TutorUpdateFormValidator extends AbstractValidator<TutorUpdateForm> {

  validator(): ValidateResult<any> {
    if (isEmpty(this.form?.firstname)) this.errors["firstname"] = "firstname is required"
    if (isEmpty(this.form?.lastname)) this.errors["lastname"] = "lastname is required"
    if (!this.isInGenderList(this.form.gender)) this.errors["gender"] = "gender is required"
    if (!isSafeNotNull(this.form?.dateOfBirth)) this.errors["dateOfBirth"] = "dateOfBirth is required"
    if (this.form?.email?.isSafeNotNull()) {
      if (!validator.isEmail(this.form.email)) this.errors["email"] = "email is in valid"
    } else {
      this.errors["email"] = "email is required"
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

  private isInGenderList(gender: number): boolean {
    return gender in Gender
  }
}

export default TutorUpdateFormValidator