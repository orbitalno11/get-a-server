import { DateTimeValue } from "../../core/constant/DateTime"

interface OfflineCourseForm {
    name: string
    subject: number
    grade: number
    type: number
    dayOfWeek: DateTimeValue
    startTime: string
    endTime: string
    cost: number
}

export default OfflineCourseForm