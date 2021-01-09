import { TutorEntity } from '../../../entity/profile/tutor.entity'
import Contact from '../../../model/Contact'
import TutorProfile from '../../../model/profile/TutorProfile'

const TutorEntityToTutorProfile = (from: TutorEntity): TutorProfile => {
  const out = new TutorProfile()
  out.firstname = from.member.firstname
  out.lastname = from.member.lastname
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

export { TutorEntityToTutorProfile }