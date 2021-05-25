import Mapper from "../../../core/common/Mapper"
import { ClipEntity } from "../../../entity/course/clip/Clip.entity"
import ClipDetail from "../../../model/clip/ClipDetail"

export class ClipEntityToClipDetailMapper implements Mapper<ClipEntity, ClipDetail> {
    map(from: ClipEntity): ClipDetail {
        const detail = new ClipDetail()
        detail.id = from.id
        detail.name = from.name
        detail.description = from.description
        detail.clipUrl = from.url
        return detail
    }
}