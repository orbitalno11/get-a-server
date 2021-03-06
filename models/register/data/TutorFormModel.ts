import TutorForm from "../TutorForm"

class TutorFormModel implements TutorForm {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    email: string
    password: string
    confirmPassword: string
    subject1: number
    subject2: number | null
    subject3: number | null
   

    constructor(data: TutorForm) {
        this.firstname = data.firstname
        this.lastname = data.lastname
        this.gender = data.gender
        this.dateOfBirth = new Date(data.dateOfBirth)
        this.email = data.email
        this.password = data.password
        this.confirmPassword = data.confirmPassword
        this.subject1 = Number(data.subject1)
        this.subject2 = Number(data.subject2)
        this.subject3 = Number(data.subject3)
    }
}

export default TutorFormModel