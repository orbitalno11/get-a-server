import Register from './Register'
import { Subject } from "../../common/data/Subject"

class TutorForm extends Register {
  subject1: Subject
  subject2: Subject | null
  subject3: Subject | null

  public static createFromBody(data: TutorForm): TutorForm {
    const form = new TutorForm()
    form.firstname = data.firstname
    form.lastname = data.lastname
    form.gender = data.gender
    form.dateOfBirth = new Date(data.dateOfBirth)
    form.email = data.email
    form.password = data.password
    form.confirmPassword = data.confirmPassword
    form.phoneNumber = data.phoneNumber
    form.subject1 = data.subject1
    form.subject2 = data.subject2?.isSafeNotNull() ? data.subject2 : null
    form.subject3 = data.subject3?.isSafeNotNull() ? data.subject3 : null
    return form
  }
}

export default TutorForm
