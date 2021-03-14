import { Request, Response, NextFunction } from "express"
import HttpStatusCode from "../../core/constant/HttpStatusCode"
import ControllerCRUD from "../../core/Controller"
import { launch } from "../../core/extension/launch"
import { SuccessResponse, FailureResponse } from "../../core/response/ResponseHandler"
import { logger } from "../../utils/log/logger"
import TokenManager from "../../utils/token/TokenManager"
import UserManager from "../../utils/UserManager"


class AuthenticationConroller extends ControllerCRUD {
    getTokenProfile(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const token: string = req.query.token as string
            try {
                if (token.isNotSafeNull()) {
                    logger.error("Can not found token")
                    return next(new FailureResponse("Can not found token", HttpStatusCode.HTTP_404_NOT_FOUND))
                }

                const validToken = await TokenManager.verifyFirebaseToken(token)
                if (!validToken) return next(new FailureResponse("Yout token is invalid", HttpStatusCode.HTTP_401_UNAUTHORIZED))

                const firebaseUser = await TokenManager.decodeFirebaseToken(token)
                const userData = await UserManager.getUser(firebaseUser["uid"])

                if (!userData) {
                    logger.error("Can not find user from token")
                    return next(new FailureResponse("Can not find user from token", HttpStatusCode.HTTP_404_NOT_FOUND))
                }
                if (!userData["id"]) {
                    logger.error("Can not find user id")
                    return next(new FailureResponse("Can not find user id", HttpStatusCode.HTTP_404_NOT_FOUND))
                }

                const generateToken = TokenManager.generateToken(userData)

                return next(new SuccessResponse(generateToken))
            } catch (err) {
                logger.error(err)
                return next(new FailureResponse("Unexpoected error while generate token", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
            }
        }, next)
    }

    create(req: Request, res: Response, next: NextFunction) {}

    read(req: Request, res: Response, next: NextFunction) {}

    update(req: Request, res: Response, next: NextFunction) {}

    delete(req: Request, res: Response, next: NextFunction) {}
}

export default AuthenticationConroller