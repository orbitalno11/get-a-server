import { Subject } from "../common/data/Subject"
import { Grade } from "../common/data/Grade"

class OnlineCourseForm {
    name: string
    subject: Subject
    grade: Grade
    coverUrl: string

    public static createFromBody(body: OnlineCourseForm): OnlineCourseForm {
        const form = new OnlineCourseForm()
        form.name = body.name
        form.subject = body.subject
        form.grade = Number(body.grade)
        return form
    }
}

export default OnlineCourseForm