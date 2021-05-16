import Register from "./Register"

class LearnerForm extends Register {
  grade: number

  public static createFromBody(data: LearnerForm): LearnerForm {
    const out = new LearnerForm()
    out.grade = Number(data.grade)
    out.firstname = data.firstname
    out.lastname = data.lastname
    out.gender = data.gender
    out.dateOfBirth = new Date(data.dateOfBirth)
    out.email = data.email
    out.phoneNumber = data.phoneNumber
    out.password = data.password
    out.confirmPassword = data.confirmPassword
    return out
  }
}

export default LearnerForm