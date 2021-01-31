import MemberUpdateForm from "../../../models/member/MemberUpdateForm"

const MemberUpdateFromToArrayMapper = (id: string, from: MemberUpdateForm) => (
    [
        from.firstname,
        from.lastname,
        from.gender,
        from.dateOfBirth,
        from.profileUrl,
        from.email,
        from.username,
        from.updated,
        id
    ]
)

export default MemberUpdateFromToArrayMapper