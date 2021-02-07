import UserRole from "../../../core/constant/UserRole"
import Member from "../../../models/member/Member"
import TutorForm from "../../../models/register/TutorForm"

const TutorFormToMemberMapper = (form: TutorForm): Member => (
    {
        id: null,
        firstname: form.firstname,
        lastname: form.lastname,
        dateOfBirth: new Date(form.dateOfBirth),
        gender: form.gender,
        profileUrl: null,
        email: form.email,
        username: form.email,
        address1: null,
        address2: null,
        created: new Date(),
        updated: new Date(),
        role: UserRole.TUTOR
    }
)

export default TutorFormToMemberMapper