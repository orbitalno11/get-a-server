import validator from "validator"
import AbstractValidator from "../AbstractValidator"
import UpdateProfileForm from "../../../model/form/update/UpdateProfileForm"
import ValidateResult from "../ValidateResult"
import { Gender } from "../../../model/common/data/Gender"
import { isEmpty, isSafeNotNull } from "../../../core/extension/CommonExtension"
import { UserRole } from "../../../core/constant/UserRole"
import { Grade } from "../../../model/common/data/Grade"
import { Subject } from "../../../model/common/data/Subject"

class UpdateProfileFormValidator extends AbstractValidator<UpdateProfileForm> {
    private readonly userRole: UserRole

    constructor(userRole: UserRole) {
        super()
        this.userRole = userRole
    }

    validator(): ValidateResult<any> {
        if (!this.form.firstname?.isSafeNotBlank()) {
            this.errors["firstname"] = "firstname is required"
        }
        if (!this.form.lastname?.isSafeNotBlank()) {
            this.errors["lastname"] = "lastname is required"
        }
        if (!(this.form.gender in Gender)) {
            this.errors["gender"] = "gender is required or invalid"
        }
        if (!isSafeNotNull(this.form?.dateOfBirth)) {
            this.errors["dateOfBirth"] = "date of birth is required or invalid"
        }
        if (this.form.email?.isSafeNotBlank()) {
            if (!validator.isEmail(this.form.email)) {
                this.errors["email"] = "e-mail is invalid"
            }
        } else {
            this.errors["email"] = "e-mail is required"
        }
        if (this.form.phoneNumber?.isSafeNotBlank()) {
            if (!validator.isMobilePhone(this.form.phoneNumber, "th-TH")) {
                this.errors["phoneNumber"] = "phone number is invalid"
            }
        } else {
            this.errors["phoneNumber"] = "phone number is required"
        }
        if (!this.form.username?.isSafeNotBlank()) {
            this.errors["username"] = "username is required"
        }
        if (this.userRole === UserRole.LEARNER) {
            this.checkLearner()
        }

        if (this.userRole === UserRole.TUTOR) {
            this.checkTutor()
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private checkLearner() {
        if (!(this.form.grade in Grade)) {
            this.errors["grade"] = "grade is invalid"
        }
    }

    private checkTutor() {
        if (this.form?.subject1.isSafeNotNull()) {
            if (!this.isSubjectCode(this.form.subject1))
                this.errors["subject1"] = "subject1 is invalid"
        } else {
            this.errors["subject1"] = "subject1 is required"
        }

        if (this.form?.subject2?.isSafeNotNull()) {
            if (!this.isSubjectCode(this.form.subject2))
                this.errors["subject2"] = "subject2 is invalid"
        }

        if (this.form?.subject3?.isSafeNotNull()) {
            if (!this.isSubjectCode(this.form.subject3))
                this.errors["subject3"] = "subject3 is invalid"
        }
    }

    private isSubjectCode(code: string): boolean {
        return code in Subject
    }
}

export default UpdateProfileFormValidator