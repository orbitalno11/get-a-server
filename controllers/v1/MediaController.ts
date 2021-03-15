import { Request, Response, NextFunction } from "express"
import HttpStatusCode from "../../core/constant/HttpStatusCode"

// controller
import ControllerCRUD from "../../core/Controller"
import { launch } from "../../core/extension/launch"
import FailureResponse from "../../core/response/FailureResponse"
import FileManager from "../../utils/FileManager"
import { logger } from "../../utils/log/logger"

class MediaController extends ControllerCRUD {
    create(req: Request, res: Response, next: NextFunction) { }
    read(req: Request, res: Response, next: NextFunction) { }
    update(req: Request, res: Response, next: NextFunction) { }
    delete(req: Request, res: Response, next: NextFunction) { }

    getImage(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const name = req.params.name

            if (!name.isSafeNotNull()) return next(new FailureResponse("Cannot found file", HttpStatusCode.HTTP_400_BAD_REQUEST))

            try {
                const fileManager = new FileManager()
                const filePath = fileManager.getProfileImagePath(name)
                return res.download(filePath)
            } catch (error) {
                logger.error(error)
                return next(new FailureResponse("Cannot get your file", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
            }
        }, next)
    }
}

export default MediaController