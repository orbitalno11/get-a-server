import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserErrorType from "../../../core/exceptions/model/UserErrorType"
import FailureResponse from "../../../core/response/FailureResponse"

const ErrorExceptionToFailureResponseMapper = (from: ErrorExceptions<any>, code: number): FailureResponse<any> => {
    const failure = new FailureResponse(from["type"], code, from["message"])
    return failure
}
export default ErrorExceptionToFailureResponseMapper