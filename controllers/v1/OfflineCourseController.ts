import { Request, Response, NextFunction } from "express"
import { v4 as uuidV4 } from "uuid"
import DatabaseConnection from "../../configs/DatabaseConnection"
import HttpStatusCode from "../../core/constant/HttpStatusCode"
import ControllerCRUD from "../../core/Controller"
import { launch } from "../../core/extension/launch"
import FailureResponse from "../../core/response/FailureResponse"
import SuccessResponse from "../../core/response/SuccessResponse"
import OfflineCourseFormModel from "../../models/course/data/OfflineCourseFormModel"
import OfflineCourseModel from "../../models/course/data/OfflineCourseModel"
import OfflineCourseForm from "../../models/course/OfflineCourseForm"
import OfflineCourseRepository from "../../repository/OfflineCourseRepository"
import { logger } from "../../utils/log/logger"
import OfflineCourseFormValidator from "../../utils/validator/course/OfflineCourseFormValidator"

class OfflineCourseController extends ControllerCRUD {
    private readonly databaseConnection: DatabaseConnection = new DatabaseConnection()
    private readonly offlineCourseRepository: OfflineCourseRepository = new OfflineCourseRepository(this.databaseConnection)

    create(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const userId = req.currentUser.id
            
            if (!userId?.isSafeNotNull()) {
                logger.error("user is invalid")
                return next(new FailureResponse("Con not found user", HttpStatusCode.HTTP_400_BAD_REQUEST))
            }

            const data: OfflineCourseForm = OfflineCourseFormModel.create(req.body)
            const validate = new OfflineCourseFormValidator(data).validate()

            if (!validate.valid) {
                logger.error("data is invalid")
                return next(new FailureResponse("Course data is invalid", HttpStatusCode.HTTP_400_BAD_REQUEST, validate.error))
            }

            const courseId = uuidV4()
            let courseData = OfflineCourseModel.create(data, courseId, userId)
            try {
                await this.offlineCourseRepository.insertCourse(courseData)
                return next(new SuccessResponse(courseId))
            } catch (error) {
                logger.error(error)
                return next(new FailureResponse(error["message"], HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, error))
            }

        }, next)
    }
    read(req: Request, res: Response, next: NextFunction) { }
    update(req: Request, res: Response, next: NextFunction) { }
    delete(req: Request, res: Response, next: NextFunction) { }
}

export default OfflineCourseController