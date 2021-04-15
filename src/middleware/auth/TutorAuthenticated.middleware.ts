import {HttpStatus, Injectable, NestMiddleware} from "@nestjs/common"
import {NextFunction, Request, Response} from "express"
import TokenManager from "../../utils/token/TokenManager"
import FailureResponse from "../../core/response/FailureResponse"
import {UserRoleKey} from "../../core/constant/UserRole"

@Injectable()
class TutorAuthenticated implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenManager = new TokenManager()
            const token = tokenManager.extractAuthToken(req)

            if (!token) {
                throw FailureResponse.create("Can not found token", HttpStatus.UNAUTHORIZED)
            }

            const isValidToken = await tokenManager.verifyToken(token)
            if (!isValidToken) {
                throw FailureResponse.create("Your token is invalid", HttpStatus.UNAUTHORIZED)
            }

            const decodedToken = await tokenManager.decodeToken(token)
            if (decodedToken.role === UserRoleKey.TUTOR || decodedToken.role === UserRoleKey.TUTOR_LEARNER) {
                req.currentUser = decodedToken
                next()
            } else {
                throw FailureResponse.create("You don't have permission", HttpStatus.UNAUTHORIZED)
            }
        } catch (error) {
            throw error
        }
    }
}

export default TutorAuthenticated