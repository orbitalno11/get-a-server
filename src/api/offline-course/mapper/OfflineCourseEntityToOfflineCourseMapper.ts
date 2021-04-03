import {OfflineCourseEntity} from "../../../entity/course/offline/offlineCourse.entity";
import OfflineCourse from "../../../model/course/OfflineCourse";
import {getDayOfWeekTh} from "../../../utils/DateTime";
import Subject from "../../../model/common/Subject";
import Grade from "../../../model/common/Grade";
import {OfflineCourseRatingTransactionEntity} from "../../../entity/course/offline/offlineCourseRatingTransaction.entity";
import {OfflineCourseReviewToReviewMapper} from "./OfflineCourseReviewToReviewMapper";
import {TutorEntityToTutorProfile} from "../../tutor/mapper/TutorEntityToTutorProfileMapper";

export const OfflineCourseEntityToOfflineCourseMapper = (from: OfflineCourseEntity): OfflineCourse => {
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
    course.subject = new Subject(from.subject.code, from.subject.title)
    course.grade = new Grade(from.grade.grade, from.grade.title)
    course.rating = from.rating?.rating ? from.rating?.rating : 0.0
    course.status = from.status
    course.requestNumber = from.requestList?.length ? from.requestList.length : 0.0
    course.review = toReviewArray(from.courseReview)
    course.owner = TutorEntityToTutorProfile(from.owner)
    return course
}

const toReviewArray = (list: OfflineCourseRatingTransactionEntity[]): Review[] => {
    const out: Review[] = []
    list.forEach(data => {
        out.push(OfflineCourseReviewToReviewMapper(data))
    })
    list.sort((previous, current) => {
        return previous.reviewDate.getTime() - current.reviewDate.getTime()
    })
    return out
}