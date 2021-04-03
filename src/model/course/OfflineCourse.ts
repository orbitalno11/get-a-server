import TutorProfile from "../profile/TutorProfile"
import { DateTimeValue } from "../../core/constant/DateTime"
import { Subject } from "../common/Subject"
import { Grade } from "../common/Grade"
import { CourseType } from "./CourseType"
import { CourseStatus } from "./CourseStatus"

class OfflineCourse {
  id: string
  owner: TutorProfile
  name: string
  description: string | null
  subject: Subject
  grade: Grade
  type: CourseType
  dayOfWeek: DateTimeValue
  startTime: string
  endTime: string
  cost: number
  status: CourseStatus
  requestNumber: number
}

export default OfflineCourse