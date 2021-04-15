import { Gender } from "../../common/data/Gender"

class TutorUpdateForm {
  firstname: string
  lastname: string
  gender: Gender
  dateOfBirth: Date
  profileUrl: string | null
  email: string
  username: string
  introduction: string | null
  facebookUrl: string | null
  lineId: string | null
  phoneNumber: string
  updated: Date | null

  public static createFromBody(data: TutorUpdateForm): TutorUpdateForm {
    const form = new TutorUpdateForm()
    form.firstname = data.firstname
    form.lastname = data.lastname
    form.gender = data.gender
    form.dateOfBirth = new Date(data.dateOfBirth)
    form.profileUrl = data.profileUrl
    form.email = data.email
    form.username = data.username
    form.introduction = data.introduction
    form.lineId = data.lineId
    form.facebookUrl = data.facebookUrl
    form.phoneNumber = data.phoneNumber
    return form
  }
}

export default TutorUpdateForm