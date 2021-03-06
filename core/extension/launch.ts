import { NextFunction } from "express"
import { logger } from "../../utils/log/logger"
import HttpStatusCode from "../constant/HttpStatusCode"
import FailureResponse from "../response/FailureResponse"

export const launch = (fx: any, next: NextFunction) => {
    Promise.resolve(fx()).catch(error => {
        logger.error("launch function error")
        logger.error(error)
        return next(new FailureResponse("Unexpected error", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
    })
}