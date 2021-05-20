import { LearnerEntity } from "../../../entity/profile/learner.entity"
import LearnerProfile from "../../../model/profile/LearnerProfile"
import Contact from "../../../model/Contact"
import Grade from "../../../model/common/Grade"
import { MemberAddressToAddressMapper } from "../location/MemberAddressToAddress.mapper"
import Mapper from "../../../core/common/Mapper"
import { MemberAddressEntity } from "../../../entity/member/memberAddress.entity"
import Address from "../../../model/location/Address"
import { LocationType } from "../../../model/location/data/LocationType"
import { isNotEmpty } from "../../../core/extension/CommonExtension"

export class LearnerEntityToLearnerProfile implements Mapper<LearnerEntity, LearnerProfile> {
    map(from: LearnerEntity): LearnerProfile {
        const out = new LearnerProfile()
        out.firstname = from.member.firstname
        out.lastname = from.member.lastname
        out.fullNameText = `${from.member.firstname} ${from.member.lastname}`
        out.gender = from.member.gender
        out.dateOfBirth = from.member.dateOfBirth
        out.profileUrl = from.member.profileUrl
        out.email = from.member.email
        out.contact = Contact.createFromContactEntity(from.contact)
        out.address = this.getConvenienceAddress(from.member?.memberAddress)?.fullAddressText
        out.grade = new Grade(from.grade?.grade, from.grade?.title)
        out.created = from.member.created
        out.updated = from.member.updated
        return out
    }

    private getConvenienceAddress(addressList: MemberAddressEntity[]): Address | null {
        const address = addressList.filter((item) => {
            return item.type === LocationType.CONVENIENCE
        })
        return isNotEmpty(address) ? MemberAddressToAddressMapper(address[0]) : null
    }
}