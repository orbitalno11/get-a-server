import OfflineCourse from "../../../../models/course/OfflineCourse"
import OfflineCourseToArrayMapper from "../../../../utils/mapper/query/OfflineCourseToArrayMapper"

describe("Test offline course to array mapper", () => {
    test("#1 map admin success", () => {
        const inputValue: OfflineCourse = {
            course_id: "test",
            owner_id: "test",
            name: "test",
            subject: 1,
            grade: 1,
            type: 1,
            dayOfWeek: 1,
            startTime: "10:30",
            endTime: "11:30",
            cost: 500,
            description: "test",
            status: "test",
            requestNumber: 100
        }

        const expectedValue = [
            "test",
            "test",
            1,
            1,
            1,
            "test",
            "test",
            500,
            1,
            "10:30",
            "11:30",
            "test",
            100
        ]

        const actualValue = OfflineCourseToArrayMapper(inputValue)

        expect(actualValue).toEqual(expectedValue)
    })
})