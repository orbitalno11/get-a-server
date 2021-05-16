import { MemberEntity } from '../../../entity/member/member.entitiy'
import LearnerForm from '../../../model/form/register/LearnerForm'


const LearnerFormToMemberEntityMapper = (from: LearnerForm): MemberEntity => {
    const member = new MemberEntity()
    member.id = null
    member.firstname = from.firstname
    member.lastname = from.lastname
    member.gender = from.gender
    member.dateOfBirth = from.dateOfBirth
    member.email = from.email
    member.username = from.email
    member.profileUrl = null
    return member
}

export default LearnerFormToMemberEntityMapper