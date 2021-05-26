import { LearnerEntity } from "../../../entity/profile/learner.entity"
import SimpleProfile from "../../../model/profile/SimpleProfile"
import Contact from "../../../model/Contact"

export const LearnerEntityToSimpleProfile = (from: LearnerEntity): SimpleProfile => {
    const out = new SimpleProfile()
    out.id = from.member?.id
    out.firstName = from.member?.firstname
    out.lastName = from.member?.lastname
    out.fullName = `${out.firstName} ${out.lastName}`
    out.picture = from.member?.profileUrl
    out.gender = from.member?.gender
    out.contact = new Contact()
    out.contact.lineId = from.contact?.lineId
    out.contact.facebookUrl = from.contact?.facebookUrl
    out.contact.phoneNumber = from.contact?.phoneNumber
    return out
}