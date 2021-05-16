import {TutorEntity} from '../../../entity/profile/tutor.entity'
import Contact from '../../../model/Contact'
import TutorProfile from '../../../model/profile/TutorProfile'
import Mapper from "../../../core/common/Mapper";
import Subject from "../../../model/common/Subject"
import { MemberAddressToAddressMapper } from "../location/MemberAddressToAddress.mapper"

export class TutorEntityToTutorProfile implements Mapper<TutorEntity, TutorProfile> {
    map(from: TutorEntity): TutorProfile {
        const out = new TutorProfile()
        out.id = from.member.id
        out.firstname = from.member.firstname
        out.lastname = from.member.lastname
        out.fullNameText = `${from.member.firstname} ${from.member.lastname}`
        out.gender = from.member.gender
        out.dateOfBirth = from.member.dateOfBirth
        out.profileUrl = from.member.profileUrl
        out.email = from.member.email
        out.contact = Contact.createFromContactEntity(from.contact)
        out.address = from.member?.memberAddress?.map((item) => MemberAddressToAddressMapper(item))
        out.introduction = from.introduction
        out.subject = from.member?.interestedSubject?.map((item) => new Subject(item?.subject?.code, item?.subject?.title))
        out.created = from.member.created
        out.updated = from.member.updated
        return out
    }
}