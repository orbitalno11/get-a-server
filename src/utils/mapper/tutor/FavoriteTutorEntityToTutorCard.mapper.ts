import { FavoriteTutorEntity } from "../../../entity/favoriteTutor.entity"
import TutorCard from "../../../model/profile/TutorCard"
import Subject from "../../../model/common/Subject"
import { MemberAddressToAddressMapper } from "../location/MemberAddressToAddress.mapper"
import { MemberAddressEntity } from "../../../entity/member/memberAddress.entity"
import Address from "../../../model/location/Address"
import { LocationType } from "../../../model/location/data/LocationType"
import { isNotEmpty } from "../../../core/extension/CommonExtension"
import { InterestedSubjectEntity } from "../../../entity/member/interestedSubject.entity"
import Mapper from "../../../core/common/Mapper"

export class FavoriteTutorEntityToTutorCardMapper implements Mapper<FavoriteTutorEntity, TutorCard> {
    map(from: FavoriteTutorEntity): TutorCard {
        const card = new TutorCard()
        card.id = from.tutor?.member?.id
        card.fullNameText = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
        card.rating = from.tutor?.statistic?.rating
        card.subject = new Subject("MTH", "MTH")
        card.address = this.getConvenienceAddress(from.tutor?.member?.memberAddress)
        card.subject = this.getFirstSubject(from.tutor?.member?.interestedSubject)
        return card
    }

    private getConvenienceAddress(addressList: MemberAddressEntity[]): Address | null {
        const convenience = addressList.filter((item) => {
            return item.type === LocationType.CONVENIENCE
        })
        return isNotEmpty(convenience) ? MemberAddressToAddressMapper(convenience[0]) : null
    }

    private getFirstSubject(subjectList: InterestedSubjectEntity[]): Subject | null {
        const rankOneSubject = subjectList.filter((item) => {
            return item.subjectRank === 1
        })
        return isNotEmpty(rankOneSubject) ? new Subject(rankOneSubject[0].subject?.code, rankOneSubject[0].subject?.title) : null
    }
}

export class FavoriteTutorEntityToTutorCardListMapper implements Mapper<FavoriteTutorEntity[], TutorCard[]> {
    map(from: FavoriteTutorEntity[]): TutorCard[] {
        return from.map((item) => new FavoriteTutorEntityToTutorCardMapper().map(item))
    }
}

