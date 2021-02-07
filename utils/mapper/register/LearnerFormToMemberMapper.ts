import UserRole from "../../../core/constant/UserRole"
import LearnerForm from "../../../models/register/LearnerForm"
import Member from "../../../models/member/Member"

const LearnerFormToMemberMapper = (from: LearnerForm): Member => (
    {
        id: null,
        firstname: from.firstname,
        lastname: from.lastname,
        dateOfBirth: new Date(from.dateOfBirth),
        gender: from.gender,
        profileUrl: null,
        email: from.email,
        username: from.email,
        address1: null,
        address2: null,
        created: new Date(),
        updated: new Date(),
        role: UserRole.LEARNER
    }
)

export default LearnerFormToMemberMapper