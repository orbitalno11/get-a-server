import { Response, Request, NextFunction } from "express"
import FailureResponse from "./FailureResponse"
import SuccessResponse from "./SuccessResponse"
import { logger } from "../../utils/log/logger"
import HttpStatusCode from "../constant/HttpStatusCode"

const handleResponse = (response: FailureResponse<any> | SuccessResponse<any>, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message, data, success } = response
    statusCode = statusCode !== undefined ? statusCode : HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR
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