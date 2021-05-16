import { DayOfWeek } from "../../core/constant/DateTime"
import { Subject } from "../common/data/Subject"
import { Grade } from "../common/data/Grade"
import { CourseType } from "./data/CourseType"

class OfflineCourseForm {
  name: string
  description: string
  subject: Subject
  grade: Grade
  type: CourseType
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  cost: number

  // static method
  public static createFromBody(from: OfflineCourseForm): OfflineCourseForm {
    const course = new OfflineCourseForm()
    course.name = from.name
    course.description = from.description
    course.subject = from.subject
    course.grade = from.grade
    course.dayOfWeek = from.dayOfWeek
    course.startTime = from.startTime
    course.endTime = from.endTime
    course.cost = Number(from.cost)
    course.type = from.type
    return course
  }
}

export default OfflineCourseForm