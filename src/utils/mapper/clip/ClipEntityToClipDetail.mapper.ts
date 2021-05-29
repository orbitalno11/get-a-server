import Mapper from "../../../core/common/Mapper"
import { ClipEntity } from "../../../entity/course/clip/Clip.entity"
import ClipDetail from "../../../model/clip/ClipDetail"
import { TutorEntityToPublicProfileMapper } from "../tutor/TutorEntityToPublicProfile.mapper"
import { OnlineCourseToCourseCardMapper } from "../course/online/OnlineCourseToCourseCard.mapper"

export class ClipEntityToClipDetailMapper implements Mapper<ClipEntity, ClipDetail> {
    map(from: ClipEntity): ClipDetail {
        const detail = new ClipDetail()
        detail.id = from.id
        detail.name = from.name
        detail.description = from.description
        detail.cost = from.cost
        detail.clipUrl = from.url
        detail.owner = from.owner ? TutorEntityToPublicProfileMapper.getTutorNameCard(from.owner) : undefined
        detail.course = from.onlineCourse ? new OnlineCourseToCourseCardMapper().map(from.onlineCourse) : undefined
        return detail
    }

    mapList(from: ClipEntity[]): ClipDetail[] {
        return from.map((item) => this.map(item))
    }

    mapBoughtList(allClips: ClipEntity[], boughtClips: ClipEntity[]): ClipDetail[] {
        return allClips.map((item) => {
            const clip = this.map(item)
            clip.bought = boughtClips.some((boughtClip) => boughtClip.id === item.id)
            return clip
        })
    }
}