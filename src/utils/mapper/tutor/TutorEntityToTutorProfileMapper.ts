import {TutorEntity} from '../../../entity/profile/tutor.entity'
import Contact from '../../../model/Contact'
import TutorProfile from '../../../model/profile/TutorProfile'
import Mapper from "../../../core/common/Mapper";

export class TutorEntityToTutorProfile implements Mapper<TutorEntity, TutorProfile> {
    map(from: TutorEntity): TutorProfile {
        const out = new TutorProfile()
        out.id = from.member.id
        out.firstname = from.member.firstname
        out.lastname = from.member.lastname
        out.fullName = `${from.member.firstname} ${from.member.lastname}`
        out.gender = from.member.gender
        out.dateOfBirth = from.member.dateOfBirth
        out.profileUrl = from.member.profileUrl
        out.introduction = from.introduction
        out.email = from.member.email
        out.contact = Contact.createFromContactEntity(from.contact)
        out.address = null // TODO map address when system can insert address
        out.created = from.member.created
        out.updated = from.member.updated
        return out
    }
}