import { DateTimeValue } from "../../../core/constant/DateTime"
import { getDayofWeekValue } from "../../../core/utils/DateTime"
import OfflineCourseForm from "../OfflineCourseForm"

class OfflineCourseFormModel implements OfflineCourseForm {
    name: string
    subject: number
    grade: number
    type: number
    dayOfWeek: DateTimeValue
    startTime: string
    endTime: string
    cost: number
    
    constructor(name: string, subject: number, grade: number, type: number, dayOfWeek: number, startTime: string, endTime: string, cost: number) {
        this.name = name
        this.subject = subject
        this.grade = grade
        this.type = type
        this.dayOfWeek = getDayofWeekValue(dayOfWeek)
        this.startTime = startTime
        this.endTime = endTime
        this.cost = cost
    }

    static create(data: OfflineCourseForm): OfflineCourseFormModel {
        return new OfflineCourseFormModel(
            data.name,
            Number(data.subject),
            Number(data.grade),
            Number(data.type),
            Number(data.dayOfWeek),
            data.startTime,
            data.endTime,
            Number(data.cost)
        )
    }
}

export default OfflineCourseFormModel