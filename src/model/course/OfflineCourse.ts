import TutorProfile from "../profile/TutorProfile"
import {CourseType} from "./data/CourseType"
import Subject from "../common/Subject"
import Grade from "../common/Grade"

class OfflineCourse {
    id: string
    owner: TutorProfile
    name: string
    description: string | null
    subject: Subject
    grade: Grade
    type: CourseType
    dayOfWeek: number
    startTime: string
    endTime: string
    timeText: string
    cost: number
    costText: string
    rating: number
    review: Review[]
    status: string
    requestNumber: number
    studentNumber: number
}

export default OfflineCourse