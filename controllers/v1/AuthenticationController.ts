import { Request, Response, NextFunction } from "express"
import HttpStatusCode from "../../core/constant/HttpStatusCode"
import ControllerCRUD from "../../core/Controller"
import { launch } from "../../core/extension/launch"
import { SuccessResponse, FailureResponse } from "../../core/response/ResponseHandler"
import { logger } from "../../utils/log/logger"
import TokenManager from "../../utils/token/TokenManager"
import UserManager from "../../utils/UserManager"


class AuthenticationConroller extends ControllerCRUD {
    async getTokenProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        launch(async () => {
            const currentUser = req.currentUser
            try {
                if (!currentUser) return next(new FailureResponse("Can not find user from token", HttpStatusCode.HTTP_404_NOT_FOUND))
                if (!currentUser["id"]) return next(new FailureResponse("Can not find user id", HttpStatusCode.HTTP_404_NOT_FOUND))

                const user = await UserManager.getUser(currentUser["id"])
                const generateToken = TokenManager.generateSimpleProfileTokenData(user)

                return next(new SuccessResponse(generateToken))
            } catch (err) {
                logger.error(err)
                return next(new FailureResponse("Unexpoected error while generate token", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
            }
        }, next)
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
}

export default AuthenticationConroller