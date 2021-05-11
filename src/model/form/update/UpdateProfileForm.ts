import { Gender } from "../../common/data/Gender"
import { Grade } from "../../common/data/Grade"

class UpdateProfileForm {
    firstname: string
    lastname: string
    gender: Gender
    dateOfBirth: Date
    email: string
    username: string
    phoneNumber: string
    lineId: string | null
    facebookUrl: string | null
    introduction: string | null
    grade: Grade
    subject1: string
    subject2: string
    subject3: string

    public static createFromBody(body: UpdateProfileForm): UpdateProfileForm {
        const form = new UpdateProfileForm()
        form.firstname = body.firstname
        form.lastname = body.lastname
        form.gender = body.gender
        form.dateOfBirth = new Date(body.dateOfBirth)
        form.email = body.email
        form.username = body.username
        form.phoneNumber = body.phoneNumber
        form.lineId = body.lineId
        form.facebookUrl = body.facebookUrl
        form.introduction = body.introduction
        form.grade = Number(body.grade)
        form.subject1 = body.subject1
        form.subject2 = body.subject2
        form.subject3 = body.subject3
        return form
    }
}

export default UpdateProfileForm