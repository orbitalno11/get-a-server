import Member from "../../../models/Member"

const MemberToArrayMapper = (from: Member) => (
    [
        from.id,
        from.firstname,
        from.lastname,
        from.gender,
        from.dateOfBirth,
        from.profileUrl,
        from.address1,
        from.address2,
        from.email,
        from.username,
        from.created,
        from.updated
    ]
)

export default MemberToArrayMapper