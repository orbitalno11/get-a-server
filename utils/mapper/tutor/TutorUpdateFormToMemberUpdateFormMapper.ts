import MemberUpdateForm from "../../../models/member/MemberUpdateForm"
import TutorUpdateForm from "../../../models/tutor/TutorUpdateForm"

const TutorUpdateFormToMemberUpdateFormMapper = (from: TutorUpdateForm, photoPath: string | null): MemberUpdateForm => (
    {
        firstname: from.firstname,
        lastname: from.lastname,
        gender: from.gender,
        dateOfBirth: from.dateOfBirth,
        profileUrl: photoPath,
        email: from.email,
        username: from.email,
        updated: new Date()
    }
)

export default TutorUpdateFormToMemberUpdateFormMapper