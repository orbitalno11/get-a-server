import validator from "validator"
import AbstractValidator from "../AbstractValidator"
import LearnerUpdateForm from "../../../model/form/update/LearnerUpdateForm"
import ValidateResult from "../ValidateResult"
import { Gender } from "../../../model/common/Gender"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import { Grade } from "../../../model/common/Grade"

class LearnerUpdateFormValidator extends AbstractValidator<LearnerUpdateForm> {
  validator(): ValidateResult<any> {
    if (!this.form?.firstname.isSafeNotNull()) {
      this.errors["firstname"] = "firstname is required"
    }

    if (!this.form?.lastname.isSafeNotNull()) {
      this.errors["lastname"] = "lastname is required"
    }

    if (!this.isInGenderList(this.form?.gender)) {
      this.errors["gender"] = "gender is required"
    }

    if (!isSafeNotNull(this.form?.dateOfBirth)) this.errors["dateOfBirth"] = "dateOfBirth is required"

    if (this.form?.email?.isSafeNotNull()) {
      if (!validator.isEmail(this.form.email)) this.errors["email"] = "email is in valid"
    } else {
      this.errors["email"] = "email is required"
    }

    if (this.form?.phoneNumber.isSafeNotNull()) {
      if (!validator.isMobilePhone(this.form.phoneNumber, "th-TH")) this.errors["phoneNumber"] = "phone number is invalid"
    }

    if (!this.isInGradeList(this.form?.grade)) this.errors["grade"] = "grade is invalid"

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

export default LearnerUpdateFormValidator