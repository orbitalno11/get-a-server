import Mapper from "../../../../core/common/Mapper"
import { OnlineCourseEntity } from "../../../../entity/course/online/OnlineCourse.entity"
import OnlineCourseCard from "../../../../model/course/OnlineCourseCard"
import { TutorEntityToPublicProfileMapper } from "../../tutor/TutorEntityToPublicProfile.mapper"

export class OnlineCourseToCourseCardMapper implements Mapper<OnlineCourseEntity, OnlineCourseCard> {
    map(from: OnlineCourseEntity): OnlineCourseCard {
        const card = new OnlineCourseCard()
        card.id = from.id
        card.name = from.name
        card.coverUrl = from.coverUrl
        card.rating = from.rating ? from.rating?.rating : 0
        card.owner = TutorEntityToPublicProfileMapper.getTutorNameCard(from.owner)
        card.numberOfVideo = 0 // TODO keep number of clip in course
        return card
    }

    mapList(from: OnlineCourseEntity[]): OnlineCourseCard[] {
        return from.map((item) => this.map(item))
    }
}