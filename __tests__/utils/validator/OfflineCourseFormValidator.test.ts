import "../../../core/extension/string.extension"
import "../../../core/extension/number.extension"
import OfflineCourseForm from "../../../models/course/OfflineCourseForm"
import OfflineCourseFormValidator from "../../../utils/validator/course/OfflineCourseFormValidator"
import ValidateResult from "../../../utils/validator/ValidateResult"

describe("Test Offline course form validator", () => {
    let underTest: OfflineCourseFormValidator

    beforeAll(() => {
        underTest = new OfflineCourseFormValidator()
    })
    
    test("validate pass", () => {
        const inputValue: OfflineCourseForm = {
            name: "test course",
            subject: 1,
            grade: 1,
            type: 1,
            dayOfWeek: 1,
            startTime: "10:30",
            endTime: "11:30",
            cost: 500
        }

        inputValue

        const expectedValue: ValidateResult<any> = {
            valid: true,
            error: {}
        }

        underTest.setData(inputValue)
        const actualValue = underTest.validate()

        expect(actualValue).toEqual(expectedValue)
    })

    test("validate name set empty", () => {
        const inputValue: OfflineCourseForm = {
            name: "",
            subject: 1,
            grade: 1,
            type: 1,
            dayOfWeek: 1,
            startTime: "10:30",
            endTime: "11:30",
            cost: 500
        }

        inputValue

        const expectedValue: ValidateResult<any> = {
            valid: false,
            error: {
                name: "course name is required"
            }
        }

        underTest.setData(inputValue)
        const actualValue = underTest.validate()

        expect(actualValue).toEqual(expectedValue)
    })

    test("validate subject set invalid", () => {
        // const inputValue: OfflineCourseForm = {
        //     name: "test course",
        //     subject: 0,
        //     grade: 1,
        //     type: 1,
        //     dayOfWeek: 1,
        //     startTime: "10:30",
        //     endTime: "11:30",
        //     cost: 500
        // }

        // const expectedValue: ValidateResult<any> = {
        //     valid: false,
        //     error: {
        //         subject: "subject is required"
        //     }
        // }

        // underTest.setData(inputValue)
        // const actualValue = underTest.validate()

        // expect(actualValue).toEqual(expectedValue)
    })
})