import Mapper from "../../../core/common/Mapper"
import { ClipEntity } from "../../../entity/course/clip/Clip.entity"
import ClipDetail from "../../../model/clip/ClipDetail"

export class ClipEntityToClipDetailMapper implements Mapper<ClipEntity, ClipDetail> {
    map(from: ClipEntity): ClipDetail {
        const detail = new ClipDetail()
        detail.id = from.id
        detail.name = from.name
        detail.description = from.description
        detail.cost = from.cost
        detail.clipUrl = from.url
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