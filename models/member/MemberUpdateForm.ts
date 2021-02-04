interface MemberUpdateForm {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    username: string
    updated: Date | null
}

export default MemberUpdateForm