import TutorUpdateForm from "../TutorUpdateForm"

class TutorUpdateFormModel implements TutorUpdateForm {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    username: string
    introduction: string | null
    facebookUrl: string | null
    lineId: string | null
    phoneNumber: string
    updated: Date | null

    constructor(form: TutorUpdateForm) {
        this.firstname = form.firstname
        this.lastname = form.lastname
        this.gender = form.gender
        this.dateOfBirth = new Date(form.dateOfBirth)
        this.profileUrl = form.profileUrl
        this.updated = form.updated ? new Date(form.updated) : null
        this.email = form.email
        this.username = form.username
        this.introduction = form.introduction
        this.facebookUrl = form.facebookUrl
        this.lineId = form.lineId
        this.phoneNumber = form.phoneNumber
    }
}

export default TutorUpdateFormModel