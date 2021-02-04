import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import FailureResponse from "../../../core/response/FailureResponse"

const ErrorExceptionToFailureResponseMapper = (from: ErrorExceptions<any>, code: number): FailureResponse<any> => (
    new FailureResponse(from["message"], code)
)

export default ErrorExceptionToFailureResponseMapper