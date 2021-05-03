import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import TokenManager from "../../utils/token/TokenManager"

@Injectable()
class AuthenticatedRequest implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenManager = new TokenManager()
            const token = tokenManager.extractAuthToken(req)

            if (token) {
                const isValidToken = await tokenManager.verifyToken(token)
                if (!isValidToken) {
                    next()
                }
                req.currentUser = await tokenManager.decodeToken(token)
            }

            next()
        } catch (error) {
            next()
        }
    }
}

export default AuthenticatedRequest