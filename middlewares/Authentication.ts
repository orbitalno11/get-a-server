import { Request, Response, NextFunction } from "express"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import FailureResponse from "../core/response/FailureResponse"
import { logger } from "../utils/log/logger"
import TokenManager from "../utils/token/TokenManager"
import UserManager from "../utils/UserManager"
import AuthenticationErrorType from "../core/exceptions/model/AuthenticationErrorType"
import HttpStatusCode from "../core/constant/HttpStatusCode"
import CurrentUser from "../models/common/CurrentUser"
import UserRole from "../core/constant/UserRole"

class AuthenticationMiddleware {

    isSignin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = TokenManager.extractAuthToken(req)

            if (!token) return next(new FailureResponse("Can not found token", HttpStatusCode.HTTP_401_UNAUTHORIZED))

            const validToken = await TokenManager.verifyFirebaseToken(token)
            if (!validToken) return next(new FailureResponse("Your token is invalid", HttpStatusCode.HTTP_401_UNAUTHORIZED))

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
            return next(new FailureResponse(error["message"], HttpStatusCode.HTTP_403_FORBIDDEN, error["type"]))
        }
    }

    isTutor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = TokenManager.extractAuthToken(req)

            if (!token) return next(new FailureResponse("Can not found token", HttpStatusCode.HTTP_401_UNAUTHORIZED))

            const decodedToken = TokenManager.verifyToken(token)
            if (!decodedToken) return next(new FailureResponse("Your token is invalid", HttpStatusCode.HTTP_401_UNAUTHORIZED))

            if (decodedToken["role"] === UserRole.TUTOR || decodedToken["role"] === UserRole.TUTOR_LEARNER) {
                const currentUser: CurrentUser = {
                    id: decodedToken["id"],
                    token: token,
                    role: decodedToken["role"]
                }
    
                req["currentUser"] = currentUser
    
                next()
            } else {
                return next(new FailureResponse("You don't have permission", HttpStatusCode.HTTP_403_FORBIDDEN))
            }
        } catch (error) {
            logger.error(error)
            return next(new FailureResponse(error["message"], HttpStatusCode.HTTP_403_FORBIDDEN, error["type"]))
        }
    }
}

export default AuthenticationMiddleware