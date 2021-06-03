import Mapper from "../../../../core/common/Mapper"
import { OfflineCourseEntity } from "../../../../entity/course/offline/offlineCourse.entity"
import OfflineCourseCard from "../../../../model/course/OfflineCourseCard"
import { isNotEmpty } from "../../../../core/extension/CommonExtension"
import Subject from "../../../../model/common/Subject"
import Grade from "../../../../model/common/Grade"
import { getDayOfWeekTh } from "../../../DateTime"
import { CourseStatus } from "../../../../model/course/data/CourseStatus"
import Address from "../../../../model/location/Address"
import { TutorEntityToPublicProfileMapper } from "../../tutor/TutorEntityToPublicProfile.mapper"

export class OfflineCourseEntityToCardMapper implements Mapper<OfflineCourseEntity, OfflineCourseCard> {
    map(from: OfflineCourseEntity): OfflineCourseCard {
        const card = new OfflineCourseCard()
        card.id = from.id
        card.name = from.id
        card.subject = isNotEmpty(from.subject) ? Subject.create(from.subject?.code, from.subject?.title) : undefined
        card.grade = isNotEmpty(from.grade) ? new Grade(from.grade?.grade, from.grade?.title) : undefined
        card.dayOfWeek = from.day
        card.startTime = from.startTime
        card.endTime = from.endTime
        card.timeText = `${getDayOfWeekTh(from.day)} ${from.startTime}น. - ${from.endTime}น.`
        card.rating = from.statistic?.rating
        card.cost = from.cost
        card.costText = `${from.cost.toLocaleString()} บาท/ชั่วโมง`
        card.status = from.status as CourseStatus
        card.location = isNotEmpty(from.owner?.member?.memberAddress) ? new Address().getConvenienceAddress(from.owner?.member?.memberAddress) : undefined
        card.owner = TutorEntityToPublicProfileMapper.getTutorNameCard(from.owner)
        return card
    }

    mapList(from: Array<OfflineCourseEntity>): Array<OfflineCourseCard> {
        return from.map((item) => this.map(item))
    }
}