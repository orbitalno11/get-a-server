import Mapper from "../../../../core/common/Mapper"
import { OnlineCourseEntity } from "../../../../entity/course/online/OnlineCourse.entity"
import OnlineCourseCard from "../../../../model/course/OnlineCourseCard"
import { TutorEntityToPublicProfileMapper } from "../../tutor/TutorEntityToPublicProfile.mapper"
import { isNotEmpty } from "../../../../core/extension/CommonExtension"
import Subject from "../../../../model/common/Subject"
import Grade from "../../../../model/common/Grade"

export class OnlineCourseToCourseCardMapper implements Mapper<OnlineCourseEntity, OnlineCourseCard> {
    map(from: OnlineCourseEntity): OnlineCourseCard {
        const card = new OnlineCourseCard()
        card.id = from.id
        card.name = from.name
        card.subject = isNotEmpty(from.subject) ? Subject.create(from.subject?.code, from.subject?.title) : undefined
        card.grade = isNotEmpty(from.grade) ? new Grade(from.grade?.grade, from.grade?.title) : undefined
        card.coverUrl = from.coverUrl
        card.rating = from.statistic?.rating ? from.statistic?.rating : 0
        card.owner = from.owner ?TutorEntityToPublicProfileMapper.getTutorNameCard(from.owner) : undefined
        card.numberOfVideo = from.statistic?.numberOfClip
        return card
    }

    mapList(from: OnlineCourseEntity[]): OnlineCourseCard[] {
        return from.map((item) => this.map(item))
    }
}