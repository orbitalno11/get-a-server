import {HttpStatus, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import TokenManager from "../../utils/token/TokenManager";
import FailureResponse from "../../core/response/FailureResponse";
import {UserRole} from "../../core/constant/UserRole";
import TokenError from "../../core/exceptions/constants/token-error.enum"
import UserError from "../../core/exceptions/constants/user-error.enum"

@Injectable()
class LearnerAuthenticated implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenManager = new TokenManager()
            const token = tokenManager.extractAuthToken(req)

            if (!token) {
                throw FailureResponse.create(TokenError.CAN_NOT_FOUND, HttpStatus.UNAUTHORIZED)
            }

            const isValidToken = await tokenManager.verifyToken(token)
            if (!isValidToken) {
                throw FailureResponse.create(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
            }

            const decodedToken = await tokenManager.decodeToken(token)
            if (decodedToken.role === UserRole.LEARNER) {
                req.currentUser = decodedToken
                next()
            } else {
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.UNAUTHORIZED)
            }
        } catch (error) {
            throw error
        }
    }
}

export default LearnerAuthenticated