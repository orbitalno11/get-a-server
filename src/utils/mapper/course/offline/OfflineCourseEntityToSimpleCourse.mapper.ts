import { OfflineCourseEntity } from "../../../../entity/course/offline/offlineCourse.entity"
import SimpleOfflineCourse from "../../../../model/course/SimpleOfflineCourse"
import Subject from "../../../../model/common/Subject"
import Grade from "../../../../model/common/Grade"
import { getDayOfWeekTh } from "../../../DateTime"
import { CourseStatus } from "../../../../model/course/data/CourseStatus"
import { isNotEmpty } from "../../../../core/extension/CommonExtension"

export const OfflineCourseEntityToSimpleCourseMapper = (from: OfflineCourseEntity, isOwner: boolean): SimpleOfflineCourse => {
    const out = new SimpleOfflineCourse()
    out.id = from.id
    out.name = from.name
    out.subject = isNotEmpty(from.subject) ? Subject.create(from.subject?.code, from.subject?.title) : undefined
    out.grade = isNotEmpty(from.grade) ? new Grade(from.grade?.grade, from.grade?.title) : undefined
    out.dayOfWeek = from.day
    out.startTime = from.startTime
    out.endTime = from.endTime
    out.timeText = `${getDayOfWeekTh(from.day)} ${from.startTime}น. - ${from.endTime}น.`
    out.rating = from.rating?.rating
    out.cost = from.cost
    out.costText = `${from.cost} บาท/ชั่วโมง`
    out.courseType = from.courseType?.id
    out.status = from.status as CourseStatus
    if (isOwner) {
        out.requestNumber = from.requestNumber
    }
    out.studentNumber = from.studentNumber
    return out
}

export const OfflineCourseEntityToSimpleCourseListMapper = (from: OfflineCourseEntity[], isOwner: boolean = false): SimpleOfflineCourse[] => {
    return from.map((item) => OfflineCourseEntityToSimpleCourseMapper(item, isOwner))
}