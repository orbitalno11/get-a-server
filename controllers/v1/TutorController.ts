import { NextFunction, Request, Response } from "express"
import DatabaseConnection from "../../configs/DatabaseConnection"
import HttpStatusCode from "../../core/constant/HttpStatusCode"
import ControllerCRUD from "../../core/Controller"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import { isEmpty } from "../../core/extension/CommonExtension"
import { launch } from "../../core/extension/launch"
import FailureResponse from "../../core/response/FailureResponse"
import SuccessResponse from "../../core/response/SuccessResponse"
import Contact from "../../models/common/Contact"
import Member from "../../models/member/Member"
import MemberUpdateForm from "../../models/member/MemberUpdateForm"
import TutorFormModel from "../../models/register/data/TutorFormModel"
import TutorForm from "../../models/register/TutorForm"
import TutorUpdateFormModel from "../../models/tutor/data/TutorUpdateFormModel"
import TutorUpdateForm from "../../models/tutor/TutorUpdateForm"
import TutorRepository from "../../repository/TutorRepository"
import FileManager from "../../utils/FileManager"
import { logger } from "../../utils/log/logger"
import ErrorExceptionToFailureResponseMapper from "../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"
import TutorFormToMemberMapper from "../../utils/mapper/register/TutorFormToMemberMapper"
import TutorUpdateFormToContactMapper from "../../utils/mapper/tutor/TutorUpdateFormToContactMapper"
import TutorUpdateFormToMemberUpdateFormMapper from "../../utils/mapper/tutor/TutorUpdateFormToMemberUpdateFormMapper"
import TokenManager from "../../utils/token/TokenManager"
import UserManager from "../../utils/UserManager"
import TutorRegisterFormValidator from "../../utils/validator/register/TutorRegisterFormValidator"
import TutorUpdateFormValidator from "../../utils/validator/tutor/TutorUpdateFormValidator"

class TutorController extends ControllerCRUD {
    private readonly databaseConnection: DatabaseConnection = new DatabaseConnection()
    private readonly tutorRepository: TutorRepository = new TutorRepository(this.databaseConnection)

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        launch(async () => {
            const data: TutorForm = new TutorFormModel(req.body)
            const validate = new TutorRegisterFormValidator(data).validate()

            if (!validate.valid) return next(new FailureResponse("Register data is invalid", HttpStatusCode.HTTP_400_BAD_REQUEST, validate.error))

            let userId

            try {
                if (req.file === undefined) return next(new FailureResponse("Please upload image file", HttpStatusCode.HTTP_404_NOT_FOUND))

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
                    return next(ErrorExceptionToFailureResponseMapper(error, HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
                }
                if (userId !== null && userId !== undefined) {
                    UserManager.deleteUser(userId)
                }
                return next(new FailureResponse("Unexpected error while create tutor account", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, error))
            }
        }, next)
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        launch(async () => {
            const idParam = req.params.id

            if (idParam.isSafeNotNull()) return next(new FailureResponse("Can not find user id", HttpStatusCode.HTTP_404_NOT_FOUND))
            try {
                const tutorData = await this.tutorRepository.getTutorProfile(idParam)

                if (isEmpty(tutorData)) return next(new SuccessResponse("Can not find user"))

                return next(new SuccessResponse(tutorData))
            } catch (error) {
                logger.error(error)
                return next(new FailureResponse("Can not get user from database", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, error))
            }
        }, next)
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        launch(async () => {
            const idParam: string = req.params.id
            const data: TutorUpdateForm = new TutorUpdateFormModel(req.body)
            const validate = new TutorUpdateFormValidator(data).validate()

            if (!validate.valid) return next(new FailureResponse("Register data is invalid", HttpStatusCode.HTTP_400_BAD_REQUEST, validate.error))

            try {
                const tutorData = await this.tutorRepository.getTutorProfile(idParam)
                if (isEmpty(tutorData)) return next(new FailureResponse("Can not find user", HttpStatusCode.HTTP_400_BAD_REQUEST))

                const updateMemberData: MemberUpdateForm = TutorUpdateFormToMemberUpdateFormMapper(data, tutorData["profileUrl"])
                const updateContactData: Contact = TutorUpdateFormToContactMapper(data)
                const introductionText: string | null = data["introduction"]

                const file = req.file

                if (file !== undefined) {
                    const fileManager = new FileManager()
                    const filePath = await fileManager.convertImageToProfile(file.path, idParam)
                    updateMemberData["profileUrl"] = filePath
                }

                // update user email if change email
                if (tutorData["email"] !== updateMemberData["email"]) {
                    await UserManager.editUserEmail(idParam, updateMemberData["email"])
                }

                // update member data
                await this.tutorRepository.editTutorProfile(idParam, updateMemberData, updateContactData, introductionText)

                const tutor = await this.tutorRepository.getTutorProfile(idParam)

                const token = TokenManager.generateSimpleProfileTokenData({
                    id: tutor["id"],
                    email: tutor["email"],
                    username: tutor["username"],
                    role: tutor["role"]
                })
                return next(new SuccessResponse(token))
            } catch (error) {
                logger.error(error)
                return next(new FailureResponse(error["message"], HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, error))
            }
        }, next)
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    private getInterestedSubjectArray(params: TutorForm): Array<number> {
        let interestedSubject = [params["subject1"]]
        const subject2 = params["subject2"]
        if (subject2?.isSafeNumber()) {
            interestedSubject.push(subject2)
            const subject3 = params["subject3"]
            if (subject3?.isSafeNumber()) {
                interestedSubject.push(subject3)
            }
        }
        return interestedSubject
    }
}

export default TutorController