import Mapper from "../../../core/common/Mapper"
import { TutorStatisticEntity } from "../../../entity/analytic/TutorStatistic.entity"
import TutorCard from "../../../model/profile/TutorCard"
import Address from "../../../model/location/Address"
import Subject from "../../../model/common/Subject"

export class TutorStatisticEntityToTutorCardMapper implements Mapper<TutorStatisticEntity, TutorCard> {
    map(from: TutorStatisticEntity): TutorCard {
        const tutorCard = new TutorCard()
        tutorCard.id = from.tutor?.member?.id
        tutorCard.fullNameText = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
        tutorCard.pictureUrl = from.tutor?.member?.profileUrl
        tutorCard.address = new Address().getConvenienceAddress(from.tutor?.member?.memberAddress)
        tutorCard.subject = new Subject().getFirstSubject(from.tutor?.member?.interestedSubject)
        tutorCard.rating = from.rating
        return tutorCard
    }
}

export class TutorStatisticEntityToTutorCardListMapper implements Mapper<TutorStatisticEntity[], TutorCard[]> {
    map(from: TutorStatisticEntity[]): TutorCard[] {
        return from.map((item) => new TutorStatisticEntityToTutorCardMapper().map(item))
    }
}