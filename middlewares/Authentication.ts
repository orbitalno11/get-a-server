import { Request, Response, NextFunction } from "express"
import { authentication } from "../configs/firebase/FirebaseConfig"
import FailureResponse from "../core/response/FailureResponse"
import UserRole from "../models/constant/UserRole"
import { logger } from "../utils/log/logger"
import UserManager from "../utils/UserManager"

class AuthenticationMiddleware {

    private getAuthToken(req: Request) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            const token = req.headers.authorization.split("Bearer ")[1]
            req["currentUser"] = {
                id: null,
                role: null,
                token: token
            }
            return token
        } else {
            logger.error("Cannot found token")
            return null
        }
    }

    isSignin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = this.getAuthToken(req)
            
            if (!token) return next(new FailureResponse("Can not found token", 401))

            const firebaseUser = await authentication.verifyIdToken(token)
            const userData = await UserManager.getUser(firebaseUser["uid"])

            req["currentUser"]["id"] = userData["id"]
            next()
        } catch (error) {
            logger.error(error)
            return next(new FailureResponse("Unexpected error", 500))
        }
    }
}

export default AuthenticationMiddleware