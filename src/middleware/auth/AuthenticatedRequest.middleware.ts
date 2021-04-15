import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import TokenManager from "../../utils/token/TokenManager"
import FailureResponse from "../../core/response/FailureResponse"

@Injectable()
class AuthenticatedRequest implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenManager = new TokenManager()
            const token = tokenManager.extractAuthToken(req)

            if (token) {
                const isValidToken = await tokenManager.verifyToken(token)
                if (!isValidToken) {
                    return FailureResponse.create("Your token is invalid", HttpStatus.UNAUTHORIZED)
                }
                req.currentUser = await tokenManager.decodeToken(token)
            }

            next()
        } catch (error) {
            throw error
        }
    }
}

export default AuthenticatedRequest