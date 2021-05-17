import { OfflineCourseEntity } from "../../../../entity/course/offline/offlineCourse.entity"
import OfflineCourse from "../../../../model/course/OfflineCourse"
import { getDayOfWeekTh } from "../../../DateTime"
import Subject from "../../../../model/common/Subject"
import Grade from "../../../../model/common/Grade"
import Mapper from "../../../../core/common/Mapper"
import { TutorEntityToPublicProfileMapper } from "../../tutor/TutorEntityToPublicProfile.mapper"

export class OfflineCourseEntityToOfflineCourseMapper implements Mapper<OfflineCourseEntity, OfflineCourse> {
    map(from: OfflineCourseEntity): OfflineCourse {
        const course = new OfflineCourse()
        course.id = from.id
        course.name = from.name
        course.description = from.description
        course.cost = from.cost
        course.costText = `${from.cost} บาท/ชั่วโมง`
        course.dayOfWeek = from.day
        course.startTime = from.startTime
        course.endTime = from.endTime
        course.timeText = `${getDayOfWeekTh(from.day)} ${course.startTime}น. - ${course.endTime}น.`
        course.subject = Subject.create(from.subject.code, from.subject.title)
        course.grade = new Grade(from.grade.grade, from.grade.title)
        course.status = from.status
        course.studentNumber = from.studentNumber ? from.studentNumber : 0
        course.rating = from.rating?.rating ? from.rating?.rating : 0.0
        course.owner = TutorEntityToPublicProfileMapper.getTutorSimpleDetail(from.owner)
        return course
    }
}