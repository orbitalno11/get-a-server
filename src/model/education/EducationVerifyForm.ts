import { Grade } from "../common/data/Grade"
import { EducationStatus } from "./data/EducationStatus.enum"

class EducationVerifyForm {
    grade: Grade
    branch: number
    institute: number
    gpax: number
    status: EducationStatus

    // static method
    public static createFormBody(body: EducationVerifyForm): EducationVerifyForm {
        const form = new EducationVerifyForm()
        form.grade = Number(body.grade)
        form.branch = Number(body.branch)
        form.institute = Number(body.institute)
        form.gpax = Number(body.gpax)
        form.status = body.status
        return form
    }
}

export default EducationVerifyForm