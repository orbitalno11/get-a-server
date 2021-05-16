import { LearnerEntity } from "../../../entity/profile/learner.entity"
import LearnerProfile from "../../../model/profile/LearnerProfile"
import Contact from "../../../model/Contact"
import Grade from "../../../model/common/Grade"
import { MemberAddressToAddressMapper } from "../location/MemberAddressToAddress.mapper"

const LearnerEntityToLearnerProfile = (from: LearnerEntity): LearnerProfile => {
    const out = new LearnerProfile()
    out.firstname = from.member.firstname
    out.lastname = from.member.lastname
    out.gender = from.member.gender
    out.dateOfBirth = from.member.dateOfBirth
    out.profileUrl = from.member.profileUrl
    out.email = from.member.email
    out.contact = Contact.createFromContactEntity(from.contact)
    out.address = from.member?.memberAddress?.map((item) => MemberAddressToAddressMapper(item))
    out.grade = new Grade(from.grade?.grade, from.grade?.title)
    out.created = from.member.created
    out.updated = from.member.updated
    return out
}

export { LearnerEntityToLearnerProfile }