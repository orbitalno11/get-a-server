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
        card.owner = from.owner ?TutorEntityToPublicProfileMapper.getTutorNameCard(from.owner) : undefined
        card.numberOfVideo = from.numberOfClip
        return card
    }

    mapList(from: OnlineCourseEntity[]): OnlineCourseCard[] {
        return from.map((item) => this.map(item))
    }
}