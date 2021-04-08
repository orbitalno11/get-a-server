import {OfflineCourseEntity} from "../../../../entity/course/offline/offlineCourse.entity"
import OfflineCourse from "../../../../model/course/OfflineCourse"
import {getDayOfWeekTh} from "../../../DateTime"
import Subject from "../../../../model/common/Subject"
import Grade from "../../../../model/common/Grade"
import {OfflineCourseReviewToReviewMapper} from "./OfflineCourseReviewToReviewMapper"
import {TutorEntityToTutorProfilePublicMapper} from "../../tutor/TutorEntityToTutorProfilePublicMapper"
import Mapper from "../../../../core/common/Mapper";

export class OfflineCourseEntityToOfflineCoursePublicMapper implements Mapper<OfflineCourseEntity, OfflineCourse> {
    map(from: OfflineCourseEntity): OfflineCourse {
        const publicCourse = new OfflineCourse()
        publicCourse.id = from.id
        publicCourse.name = from.name
        publicCourse.description = from.description
        publicCourse.cost = from.cost
        publicCourse.costText = `${from.cost} บาท/ชั่วโมง`
        publicCourse.dayOfWeek = from.day
        publicCourse.startTime = from.startTime
        publicCourse.endTime = from.endTime
        publicCourse.timeText = `${getDayOfWeekTh(from.day)} ${publicCourse.startTime}น. - ${publicCourse.endTime}น.`
        publicCourse.subject = new Subject(from.subject.code, from.subject.title)
        publicCourse.grade = new Grade(from.grade.grade, from.grade.title)
        publicCourse.status = from.status
        publicCourse.studentNumber = from.studentNumber ? from.studentNumber : 0
        publicCourse.rating = from.rating?.rating ? from.rating?.rating : 0.0
        publicCourse.review = new OfflineCourseReviewToReviewMapper().toReviewArray(from.courseReview)
        publicCourse.owner = TutorEntityToTutorProfilePublicMapper.getTutorSimpleDetail(from.owner)
        return publicCourse
    }
}