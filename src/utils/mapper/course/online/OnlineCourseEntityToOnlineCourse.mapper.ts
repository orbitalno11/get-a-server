import Mapper from "../../../../core/common/Mapper"
import { OnlineCourseEntity } from "../../../../entity/course/online/OnlineCourse.entity"
import OnlineCourse from "../../../../model/course/OnlineCourse"
import Subject from "../../../../model/common/Subject"
import Grade from "../../../../model/common/Grade"
import { TutorEntityToPublicProfileMapper } from "../../tutor/TutorEntityToPublicProfile.mapper"

export class OnlineCourseEntityToOnlineCourseMapper implements Mapper<OnlineCourseEntity, OnlineCourse> {
    map(from: OnlineCourseEntity): OnlineCourse {
        const course = new OnlineCourse()
        course.id = from.id
        course.name = from.name
        course.coverUrl = from.coverUrl
        course.subject = Subject.create(from.subject?.code, from.subject?.title)
        course.grade = new Grade(from.grade?.grade, from.grade?.title)
        course.owner = TutorEntityToPublicProfileMapper.getTutorNameCard(from.owner)
        course.rating = from.rating?.rating
        course.numberOfView = 0 // todo keep all course view
        return course
    }

    mapList(from: OnlineCourseEntity[]): OnlineCourse[] {
        return from.map((item) => this.map(item))
    }
}