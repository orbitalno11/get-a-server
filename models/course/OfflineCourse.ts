import { DateTimeValue } from "../../core/constant/DateTime"

interface OfflineCourse {
    course_id: string
    owner_id: string
    name: string
    description: string | null
    subject: number
    grade: number
    type: number
    dayOfWeek: DateTimeValue
    startTime: string
    endTime: string
    cost: number
    status: string
    requestNumber: number
}

export default OfflineCourse