import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { CourseType } from "../../../model/course/CourseType"
import { isDayOfWeek } from "../../DateTime"

class OfflineCourseFormValidator extends AbstractValidator<OfflineCourseForm> {
  validator(): ValidateResult<any> {
    if (!this.form?.name.isSafeNotNull()) this.errors["name"] = "course name is required"

    if (!this.form?.subject.isSafeNotNull()) this.errors["subject"] = "subject is required"

    if (this.form.description.isSafeNotNull()) {
      if (this.form.description.length < 20) {
        this.errors["description"] = "description should have more than 20 character"
      }
    } else {
      this.errors["description"] = "description is required"
    }

    if (!this.form?.grade.isSafeNotNull()) this.errors["grade"] = "grade is required"

    if (this.form?.type.isSafeNotNull()) {
      if (!this.isCourseType(this.form.type)) this.errors["type"] = "course type is invalid"
    } else {
      this.errors["type"] = "course type is required"
    }

    if (this.form?.dayOfWeek.isSafeNotNull()) {
      if (!isDayOfWeek(this.form.dayOfWeek)) this.errors["dayOfWeek"] = "course day is invalid"
    } else {
      this.errors["dayOfWeek"] = "course day is required"
    }

    if (!this.form?.startTime.isSafeNotNull()) this.errors["startTime"] = "start time is required"

    if (!this.form?.endTime.isSafeNotNull()) this.errors["endTime"] = "end time is required"

    if (this.form?.cost.isSafeNotNull()) {
      if (this.form.cost.isNegativeValue()) this.errors["cost"] = "course cost is invalid"
    } else {
      this.errors["cost"] = "course cost is required"
    }

    this.isValid = isEmpty(this.errors)

    return {
      error: this.errors,
      valid: this.isValid
    }
  }

  private isCourseType(type: number): boolean {
    return type in CourseType
  }

}

export default OfflineCourseFormValidator