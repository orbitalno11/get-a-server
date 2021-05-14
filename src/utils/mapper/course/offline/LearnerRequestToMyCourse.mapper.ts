import { OfflineCourseLeanerRequestEntity } from "../../../../entity/course/offline/offlineCourseLearnerRequest.entity"
import MyCourse from "../../../../model/course/MyCourse"
import Subject from "../../../../model/common/Subject"
import { TutorEntityToPublicProfileMapper } from "../../tutor/TutorEntityToPublicProfile.mapper"
import { getDayOfWeekTh } from "../../../DateTime"

export const LearnerRequestToMyCourseMapper = (from: OfflineCourseLeanerRequestEntity): MyCourse => {
    const myCourse = new MyCourse()
    myCourse.id = from.course?.id
    myCourse.name = from.course?.name
    myCourse.subject = new Subject(from.course?.subject?.code, from.course?.subject?.title)
    myCourse.dayOfWeek = from.course?.day
    myCourse.startTime = from.course?.startTime
    myCourse.endTime = from.course?.endTime
    myCourse.timeText = `${getDayOfWeekTh(myCourse.dayOfWeek)}, ${myCourse.startTime}น.-${myCourse.endTime}น.`
    myCourse.courseType = from.course?.courseType?.id
    myCourse.status = from.status
    myCourse.owner = TutorEntityToPublicProfileMapper.getTutorSimpleDetail(from.course?.owner)
    return myCourse
}

export const LearnerRequestToMyCourseListMapper = (from: OfflineCourseLeanerRequestEntity[]): MyCourse[] => {
    return from.map((item) => LearnerRequestToMyCourseMapper(item))
}