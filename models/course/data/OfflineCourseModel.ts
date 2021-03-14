import { DateTimeValue } from "../../../core/constant/DateTime"
import { getDayofWeekValue } from "../../../core/utils/DateTime"
import OfflineCourse from "../OfflineCourse"
import OfflineCourseForm from "../OfflineCourseForm"

class OfflineCourseModel implements OfflineCourse {
    course_id: string
    owner_id: string
    name: string
    description: string | null
    subject: number
    grade: number
    type: number
    dayOfWeek: DateTimeValue
    startTime: string
    endTime: string
    cost: number
    status: string
    requestNumber: number

    constructor(
        id: string,
        owner_id: string,
        name: string,
        subject: number,
        description: string | null,
        grade: number,
        type: number,
        dayOfWeek: number,
        startTime: string,
        endTime: string,
        cost: number,
        status: string,
        request: number
    ) {
        this.course_id = id
        this.owner_id = owner_id
        this.name = name
        this.subject = subject
        this.description = description
        this.grade = grade
        this.type = type
        this.dayOfWeek = getDayofWeekValue(dayOfWeek)
        this.startTime = startTime
        this.endTime = endTime
        this.cost = cost
        this.status = status
        this.requestNumber = request
    }

    static create(data: OfflineCourseForm, id: string, owner: string, description: string = ""): OfflineCourseModel {
        return new OfflineCourseModel(
            id,
            owner,
            data.name,
            Number(data.subject),
            description,
            Number(data.grade),
            Number(data.type),
            Number(data.dayOfWeek),
            data.startTime,
            data.endTime,
            Number(data.cost),
            "test",
            0
        )
    }
}

export default OfflineCourseModel