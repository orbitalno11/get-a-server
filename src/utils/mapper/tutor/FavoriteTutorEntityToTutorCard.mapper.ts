import { FavoriteTutorEntity } from "../../../entity/favoriteTutor.entity"
import TutorCard from "../../../model/profile/TutorCard"
import Subject from "../../../model/common/Subject"
import Address from "../../../model/location/Address"
import Mapper from "../../../core/common/Mapper"

export class FavoriteTutorEntityToTutorCardMapper implements Mapper<FavoriteTutorEntity, TutorCard> {
    map(from: FavoriteTutorEntity): TutorCard {
        const card = new TutorCard()
        card.id = from.tutor?.member?.id
        card.fullNameText = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
        card.rating = from.tutor?.statistic?.rating
        card.address = new Address().getConvenienceAddress(from.tutor?.member.memberAddress)
        card.subject = new Subject().getFirstSubject(from.tutor?.member?.interestedSubject)
        return card
    }
}

export class FavoriteTutorEntityToTutorCardListMapper implements Mapper<FavoriteTutorEntity[], TutorCard[]> {
    map(from: FavoriteTutorEntity[]): TutorCard[] {
        return from.map((item) => new FavoriteTutorEntityToTutorCardMapper().map(item))
    }
}

