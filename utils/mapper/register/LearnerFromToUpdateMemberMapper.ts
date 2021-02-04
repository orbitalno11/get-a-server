import LearnerForm from "../../../models/register/LearnerForm"
import MemberUpdateForm from "../../../models/member/MemberUpdateForm"

const LearnerFormToUpdateMemberMapper = (from: LearnerForm, photoPath: string | null): MemberUpdateForm => (
    {
        firstname: from.firstname,
        lastname: from.lastname,
        gender: from.gender,
        dateOfBirth: new Date(from.dateOfBirth),
        profileUrl: photoPath,
        email: from.email,
        username: from.email,
        updated: new Date()
    }
)

export default LearnerFormToUpdateMemberMapper