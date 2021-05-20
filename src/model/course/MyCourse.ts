import { DayOfWeek } from "../../core/constant/DateTime"
import Subject from "../common/Subject"
import { CourseType } from "./data/CourseType"
import { EnrollStatus } from "./data/EnrollStatus"
import PublicProfile from "../profile/PublicProfile"

class MyCourse {
    id: string
    name: string
    subject: Subject
    dayOfWeek: DayOfWeek
    startTime: string
    endTime: string
    timeText: string
    courseType: CourseType
    status: EnrollStatus
    owner: PublicProfile
}

export default MyCourse