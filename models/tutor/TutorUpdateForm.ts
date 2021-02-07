interface TutorUpdateForm {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    username: string,
    introduction: string | null
    facebookUrl: string | null
    lineId: string | null
    phoneNumber: string
    updated: Date | null
}

export default TutorUpdateForm