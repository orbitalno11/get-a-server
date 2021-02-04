import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserErrorType from "../../../core/exceptions/model/UserErrorType"
import FailureResponse from "../../../core/response/FailureResponse"

const ErrorExceptionToFailureResponseMapper = (from: ErrorExceptions<any>, code: number): FailureResponse<any> => {
    const failure = new FailureResponse(from["message"], code, from["type"])
    return failure
}
export default ErrorExceptionToFailureResponseMapper