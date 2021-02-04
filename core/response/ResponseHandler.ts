import { Response, Request, NextFunction } from "express"
import FailureResponse from "./FailureResponse"
import SuccessResponse from "./SuccessResponse"
import { logger } from "../../utils/log/logger"
import ErrorExceptions from "../exceptions/ErrorExceptions"
import ErrorExceptionToFailureResponseMapper from "../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"

const handleResponse = (response: FailureResponse<any> | SuccessResponse<any> | ErrorExceptions<any>, req: Request, res: Response, next: NextFunction) => {
    let ret = (response instanceof ErrorExceptions) ? ErrorExceptionToFailureResponseMapper(response, 500) : response
    let { statusCode, message, data, success } = ret
    statusCode = statusCode !== undefined ? statusCode : 500
    if (response instanceof FailureResponse) logger.error(response)
    res.status(statusCode).json({
        "message": message,
        "data": data,
        "success": success
    })
}

export {
    handleResponse,
    FailureResponse,
    SuccessResponse
}