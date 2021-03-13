import LearnerForm from "../LearnerForm"

class LearnerFormModel implements LearnerForm {
    grade: number
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    email: string
    password: string
    confirmPassword: string

    constructor(form: LearnerForm) {
        this.grade = Number(form.grade)
        this.firstname = form.firstname
        this.lastname = form.lastname
        this.gender = form.gender
        this.dateOfBirth = new Date(form.dateOfBirth)
        this.email = form.email
        this.password = form.password
        this.confirmPassword = form.confirmPassword
    }
}

export default LearnerFormModel