import OfflineCourse from "../../../models/course/OfflineCourse"

const OfflineCourseToArrayMapper = (from: OfflineCourse) => (
    [
        from.course_id,
        from.owner_id,
        from.type,
        from.subject,
        from.grade,
        from.name,
        from.description,
        from.cost,
        from.dayOfWeek,
        from.startTime,
        from.endTime,
        from.status,
        from.requestNumber
    ]
)

export default OfflineCourseToArrayMapper