import { Request, Response, NextFunction } from "express"
import HttpStatusCode from "../../core/constant/HttpStatusCode"

// controller
import ControllerCRUD from "../../core/Controller"
import { isSafeNotNull } from "../../core/extension/StringExtension"
import FailureResponse from "../../core/response/FailureResponse"
import FileManager from "../../utils/FileManager"
import { logger } from "../../utils/log/logger"

class MediaController extends ControllerCRUD {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> { }
    async read(req: Request, res: Response, next: NextFunction): Promise<void> { }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> { }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> { }

    async getImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const name = req.params.name

        if (!isSafeNotNull(name)) return next(new FailureResponse("Cannot found file", HttpStatusCode.HTTP_400_BAD_REQUEST))

        try {
            const fileManager = new FileManager()
            const filePath = fileManager.getProfileImagePath(name)
            return res.download(filePath)
        } catch (error) {
            logger.error(error)
            return next(new FailureResponse("Cannot get your file", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
        }
    }
}

export default MediaController