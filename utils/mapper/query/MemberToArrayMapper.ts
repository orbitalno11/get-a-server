import Member from "../../../models/member/Member"

const MemberToArrayMapper = (from: Member) => (
    [
        from.id,
        from.firstname,
        from.lastname,
        from.gender,
        from.dateOfBirth,
        from.profileUrl,
        from.email,
        from.username,
        from.created,
        from.updated
    ]
)

export default MemberToArrayMapper