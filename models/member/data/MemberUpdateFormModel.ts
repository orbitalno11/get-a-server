import MemberUpdateForm from "../MemberUpdateForm"

class MemberUpdateFormModel implements MemberUpdateForm {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    username: string
    updated: Date | null

    constructor(form: MemberUpdateForm) {
        this.firstname = form.firstname
        this.lastname = form.lastname
        this.gender = form.gender
        this.dateOfBirth = new Date(form.dateOfBirth)
        this.profileUrl = form.profileUrl
        this.updated = form.updated ? new Date(form.updated) : null
        this.email = form.email
        this.username = form.username
    }

}

export default MemberUpdateFormModel