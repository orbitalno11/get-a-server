import validator from 'validator'
import { isEmpty, isNotNull } from '../../../core/extension/CommonExtension'
import TutorForm from '../../../model/form/register/TutorForm'
import AbstractValidator from '../AbstractValidator'
import ValidateResult from '../ValidateResult'
import { Subject } from "../../../model/common/Subject"
import { Gender } from "../../../model/common/Gender"

class TutorRegisterFormValidator extends AbstractValidator<TutorForm> {
  validator(): ValidateResult<any> {
    const passwordOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    }

    if (!this.form?.firstname.isSafeNotNull())
      this.errors['firstname'] = 'firstname is required'
    if (!this.form?.lastname.isSafeNotNull())
      this.errors['lastname'] = 'lastname is required'
    if (!this.isInGenderList(this.form.gender))
      this.errors['gender'] = 'gender is required'
    if (!isNotNull(this.form?.dateOfBirth))
      this.errors['dateOfBirth'] = 'dateOfBirth is required'
    if (this.form?.email.isSafeNotNull()) {
      if (!validator.isEmail(this.form.email))
        this.errors['email'] = 'email is in valid'
    } else {
      this.errors['email'] = 'email is required'
    }
    if (this.form?.password.isSafeNotNull()) {
      if (!validator.isStrongPassword(this.form.password, passwordOptions))
        this.errors['password'] = 'password is not strong'
    } else {
      this.errors['password'] = 'password is required'
    }

    if (this.form?.confirmPassword.isSafeNotNull()) {
      if (
        !validator.isStrongPassword(
          this.form.confirmPassword,
          passwordOptions,
        ) &&
        this.form.password !== this.form.confirmPassword
      )
        this.errors['confirmPassword'] =
          'confirmPassword is not match with password'
    } else {
      this.errors['confirmPassword'] = 'confirm-password is required'
    }

    if (this.form?.phoneNumber.isSafeNotNull()) {
      if (!validator.isMobilePhone(this.form.phoneNumber, "th-TH")) this.errors["phoneNumber"] = "phone number is invalid"
    }

    if (this.form?.subject1.isSafeNotNull()) {
      if (!this.isSubjectCode(this.form.subject1))
        this.errors['subject1'] = 'subject1 is invalid'
    } else {
      this.errors['subject1'] = 'subject1 is required'
    }

    if (this.form?.subject2?.isSafeNotNull()) {
      if (!this.isSubjectCode(this.form.subject2))
        this.errors['subject2'] = 'subject2 is invalid'
    }

    if (this.form?.subject3?.isSafeNotNull()) {
      if (!this.isSubjectCode(this.form.subject3))
        this.errors['subject3'] = 'subject3 is invalid'
    }

    this.isValid = isEmpty(this.errors)

    return {
      error: this.errors,
      valid: this.isValid,
    }
  }

  private isSubjectCode(code: string): boolean {
    return code in Subject
  }

  private isInGenderList(gender: number): boolean {
    return gender in Gender
  }
}

export default TutorRegisterFormValidator
