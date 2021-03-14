import ErrorExceptions from "../../../../core/exceptions/ErrorExceptions"
import FailureResponse from "../../../../core/response/FailureResponse"
import ErrorExceptionToFailureResponseMapper from "../../../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"

describe("Test ErrorExceptionToFailureResponseMapper", () => {
    test("#1 map success", () => {
        const inputCode = 500
        const inputValue: ErrorExceptions<string> = {
            message: "test",
            type: "test",
            name: "test"
        }

        const expectedValue = new FailureResponse("test", inputCode, "test")

        const actualValue = ErrorExceptionToFailureResponseMapper(inputValue, inputCode)

        expect(actualValue).toEqual(expectedValue)
    })
})