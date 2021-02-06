import { NextFunction, Request, Response } from "express"
import DatabaseConnection from "../../configs/DatabaseConnection"
import ControllerCRUD from "../../core/Controller"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import { isNotEmpty } from "../../core/extension/CommonExtension"
import FailureResponse from "../../core/response/FailureResponse"
import SuccessResponse from "../../core/response/SuccessResponse"
import Member from "../../models/member/Member"
import TutorForm from "../../models/register/TutorForm"
import TutorRepository from "../../repository/TutorRepository"
import FileManager from "../../utils/FileManager"
import { logger } from "../../utils/log/logger"
import ErrorExceptionToFailureResponseMapper from "../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"
import TutorFormToMemberMapper from "../../utils/mapper/register/TutorFormToMemberMapper"
import TokenManager from "../../utils/token/TokenManager"
import UserManager from "../../utils/UserManager"
import TutorRegisterFormValidator from "../../utils/validator/register/TutorRegisterFormValidator"

class TutorController extends ControllerCRUD {
    private readonly databaseConnection: DatabaseConnection = new DatabaseConnection()
    private readonly tutorRepository: TutorRepository = new TutorRepository(this.databaseConnection)

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data: TutorForm = req.body
        const validate = new TutorRegisterFormValidator(data).validate()

        if (!validate.valid) return next(new FailureResponse("Register data is invalid", 400, validate.error))

        let userId

        try {
            if (req.file === undefined) return next(new FailureResponse("Please upload image file", 404))

            // create firebase user
            const user = await UserManager.createUser(data)
            // change register form to member detail
            const inputData: Member = TutorFormToMemberMapper(data)
            inputData["id"] = user["uid"]
            userId = user["uid"]

            // set profile image path
            const fileManager = new FileManager()
            const filePath = await fileManager.convertImageToProfile(req.file.path, userId)
            inputData["profileUrl"] = filePath

            // insert learner data to database
            await this.tutorRepository.insertTutor(inputData, this.getInterestedSubjectArray(data))
            
            const token = TokenManager.generateSimpleProfileTokenData({
                id: inputData["id"],
                email: inputData["email"],
                username: inputData["username"],
                role: inputData["role"]
            })
            return next(new SuccessResponse(token))

        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) {
                const type = error["type"]
                if (type !== FileErrorType.CAN_NOT_CREATE_DIRECTORY || type !== FileErrorType.FILE_NOT_ALLOW || type !== FileErrorType.FILE_SIZE_IS_TOO_LARGE) {
                    const fileManager = new FileManager()
                    fileManager.deleteFile(req.file.path)
                }
                return next(ErrorExceptionToFailureResponseMapper(error, 500))
            }
            if (userId !== null && userId !== undefined) {
                UserManager.deleteUser(userId)
            }
            return next(new FailureResponse("Unexpected erro while create tutor account", 500))
        }
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    private getInterestedSubjectArray(params: TutorForm): Array<number> {
        let interestedSubject = [params["subject1"]]
        const subject2 = params["subject2"]
        if (subject2 !== null && subject2 !== undefined && isNotEmpty(subject2)) {
            interestedSubject.push(subject2)
            const subject3 = params["subject3"]
            if (subject3 != null && subject3 !== undefined && isNotEmpty(subject3)) {
                interestedSubject.push(subject3)
            }
        }
        return interestedSubject
    }
}

export default TutorController