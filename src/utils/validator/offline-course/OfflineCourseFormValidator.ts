import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { CourseType } from "../../../model/course/data/CourseType"
import { isDayOfWeek } from "../../DateTime"
import { Subject } from "../../../model/common/data/Subject"
import { Grade } from "../../../model/common/data/Grade"

class OfflineCourseFormValidator extends AbstractValidator<OfflineCourseForm> {
    validator(): ValidateResult<any> {
        if (this.form.name?.isSafeNotBlank()) {
            if (this.form.name?.length > 20) {
                this.errors["name"] = "course name is invalid"
            }
        } else {
            this.errors["name"] = "course name is required"
        }

        if (!this.form.subject?.isSafeNotBlank() || !(this.form.subject in Subject)) this.errors["subject"] = "subject is required"

        if (this.form.description?.isSafeNotBlank()) {
            if (this.form.description.length < 20) {
                this.errors["description"] = "description should have more than 20 character"
            }
        } else {
            this.errors["description"] = "description is required"
        }

        if (!this.form.grade?.isPositiveValue() || !(this.form.grade in Grade)) this.errors["grade"] = "grade is required"

        if (this.form.type?.isPositiveValue()) {
            if (!this.isCourseType(this.form.type)) this.errors["type"] = "course type is invalid"
        } else {
            this.errors["type"] = "course type is required"
        }

        if (this.form.dayOfWeek?.isSafeNumber()) {
            if (!isDayOfWeek(this.form.dayOfWeek)) this.errors["dayOfWeek"] = "course day is invalid"
        } else {
            this.errors["dayOfWeek"] = "course day is required"
        }

        if (!this.form.startTime?.isSafeNotBlank()) this.errors["startTime"] = "start time is required"

        if (!this.form.endTime?.isSafeNotBlank()) this.errors["endTime"] = "end time is required"

        if (this.form.cost?.isSafeNumber()) {
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