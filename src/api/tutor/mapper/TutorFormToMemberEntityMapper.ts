import { MemberEntity } from '../../../entity/member/member.entitiy';
import TutorForm from '../../../model/form/register/TutorForm';

const TutorFormToMemberEntityMapper = (from: TutorForm): MemberEntity => {
  const member = new MemberEntity();
  member.id = null;
  member.firstname = from.firstname;
  member.lastname = from.lastname;
  member.gender = from.gender;
  member.dateOfBirth = from.dateOfBirth;
  member.email = from.email;
  member.username = from.email;
  member.profileUrl = null;
  member.interestedSubject = [];
  return member;
};

export default TutorFormToMemberEntityMapper;
