import { MemberEntity } from '../../../entity/member/member.entitiy'
import Member from '../../../model/Member'

const MemberEntityToMemberMapper = (from: MemberEntity): Member => {
  const member = new Member()
  member.id = from.id
  member.firstname = from.firstname
  member.lastname = from.lastname
  member.gender = from.gender
  member.dateOfBirth = from.dateOfBirth
  member.email = from.email
  member.username = from.username
  member.profileUrl = from.profileUrl
  member.created = from.created
  member.updated = from.updated
  member.role = from.memberRole.role.id
  return member
}

export {
  MemberEntityToMemberMapper
}