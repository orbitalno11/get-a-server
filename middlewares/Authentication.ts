import { Request, Response, NextFunction } from "express"
import FailureResponse from "../core/response/FailureResponse"
import { logger } from "../utils/log/logger"
import TokenManager from "../utils/token/TokenManager"
import UserManager from "../utils/UserManager"

class AuthenticationMiddleware {

    isSignin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = TokenManager.extractAuthToken(req)

            if (!token) return next(new FailureResponse("Can not found token", 401))

            const validToken = await TokenManager.verifyToken(token)
            if (!validToken) return next(new FailureResponse("Yout token is invalid", 401))

            const firebaseUser = await TokenManager.decodeFirebaseToken(token)
            const userData = await UserManager.getUser(firebaseUser["uid"])
            
            req["currentUser"]["id"] = userData["id"]
            req["currentUser"]["token"] = token
            req["currentUser"]["role"] = userData["role"]
            
            next()
        } catch (error) {
            logger.error(error)
            return next(new FailureResponse("Unexpected error", 500))
        }
    }
}

export default AuthenticationMiddleware