import { Response, Request, NextFunction } from "express"
import FailureResponse from "./FailureResponse"
import SuccessResponse from "./SuccessResponse"

const handleResponse = (response: FailureResponse<any> | SuccessResponse<any>, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message, data, success } = response
    statusCode = statusCode !== undefined ? statusCode : 500
    if (response instanceof FailureResponse) console.error(response)
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