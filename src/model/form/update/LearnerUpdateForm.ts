import { Grade } from "../../common/Grade"
import { Gender } from "../../common/Gender"

class LearnerUpdateForm {
  firstname: string
  lastname: string
  gender: Gender
  dateOfBirth: Date
  profileUrl: string | null
  email: string
  username: string
  facebookUrl: string | null
  lineId: string | null
  phoneNumber: string
  grade: Grade
  updated: Date | null

  public static createFromBody(data: LearnerUpdateForm): LearnerUpdateForm {
    const form = new LearnerUpdateForm()
    form.firstname = data.firstname
    form.lastname = data.lastname
    form.gender = data.gender
    form.dateOfBirth = new Date(data.dateOfBirth)
    form.profileUrl = data.profileUrl
    form.email = data.email
    form.username = data.username
    form.lineId = data.lineId
    form.facebookUrl = data.facebookUrl
    form.phoneNumber = data.phoneNumber
    form.grade = data.grade
    return form
  }
}

export default LearnerUpdateForm