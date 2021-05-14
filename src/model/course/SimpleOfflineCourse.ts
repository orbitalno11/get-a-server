import { DayOfWeek } from "../../core/constant/DateTime"
import Subject from "../common/Subject"
import Grade from "../common/Grade"
import { CourseType } from "./data/CourseType"
import { CourseStatus } from "./data/CourseStatus"

class SimpleOfflineCourse {
    id: string
    name: string
    subject: Subject
    grade: Grade
    dayOfWeek: DayOfWeek
    startTime: string
    endTime: string
    timeText: string
    rating: number
    cost: number
    costText: string
    courseType: CourseType
    status: CourseStatus
    requestNumber: number
    studentNumber: number
}

export default SimpleOfflineCourse