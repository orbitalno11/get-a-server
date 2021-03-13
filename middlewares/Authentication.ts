import { Request, Response, NextFunction } from "express"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import FailureResponse from "../core/response/FailureResponse"
import { logger } from "../utils/log/logger"
import TokenManager from "../utils/token/TokenManager"
import UserManager from "../utils/UserManager"
import AuthenticationErrorType from "../core/exceptions/model/AuthenticationErrorType"
import HttpStatusCode from "../core/constant/HttpStatusCode"
import CurrentUser from "../models/common/CurrentUser"

class AuthenticationMiddleware {

    isSignin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = TokenManager.extractAuthToken(req)

            if (!token) return next(new FailureResponse("Can not found token", HttpStatusCode.HTTP_401_UNAUTHORIZED))

            const validToken = await TokenManager.verifyToken(token)
            if (!validToken) return next(new FailureResponse("Yout token is invalid", HttpStatusCode.HTTP_401_UNAUTHORIZED))

            const firebaseUser = await TokenManager.decodeFirebaseToken(token)
            const userData = await UserManager.getUser(firebaseUser["uid"])

            const currentUser: CurrentUser = {
                id: userData["id"],
                token: token,
                role: userData["role"]
            }

            req["currentUser"] = currentUser

            next()
        } catch (error) {
            logger.error(error)
            return next(new ErrorExceptions("Unexpected error", AuthenticationErrorType.UNEXPECTED_ERROR))
        }
    }
}

export default AuthenticationMiddleware