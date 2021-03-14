import validator from "validator"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { isDayOfWeek } from "../../../core/utils/DateTime"
import { CourseTypeValue } from "../../../models/course/CourseType"
import OfflineCourseForm from "../../../models/course/OfflineCourseForm"
import AbstractValidator from "../AbstractValidator"
import ValidateResult from "../ValidateResult"

class OfflineCourseFormValidator extends AbstractValidator<OfflineCourseForm> {

    constructor(data: OfflineCourseForm) {
        super(data)
    }

    validator(): ValidateResult<any> {
        if (!this.form.name.isSafeNotNull()) this.errors['name'] = "course name is required"

        if (!this.form.subject.isSafeNotNull()) this.errors['subject'] = "subject is required"

        if (!this.form.grade.isSafeNotNull()) this.errors['grade'] = "grade is required"

        if (this.form.type.isSafeNotNull()) {
            if (!this.isCoureType(this.form.type)) this.errors['type'] = "course type is invalid"
        } else {
            this.errors['type'] = "course type is required"
        }

        if (this.form.dayOfWeek.isSafeNotNull()) {
            if (!isDayOfWeek(this.form.dayOfWeek)) this.errors['dayOfWeek'] = "course day is invalid"
        } else {
            this.errors['dayOfWeek'] = "course day is required"
        }
        
        if (!this.form.startTime.isSafeNotNull()) this.errors['startTime'] = "start time is required"
        
        if (!this.form.endTime.isSafeNotNull()) this.errors['endTime'] = "end time is required"

        if (this.form.cost.isSafeNotNull()) {
            if (this.form.cost.isNegativeValue()) this.errors['cost'] = "course cost is invalid"
        } else {
            this.errors['cost'] = "course cost is required"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private isCoureType(type: number): boolean {
        return type === CourseTypeValue.OFFLINE_GROUP || type === CourseTypeValue.OFFLINE_SINGLE || type === CourseTypeValue.ONLINE
    }

}

export default OfflineCourseFormValidator