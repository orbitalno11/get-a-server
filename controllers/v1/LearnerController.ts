import { Request, Response, NextFunction } from "express"
import DatabaseConnection from "../../configs/DatabaseConnection"
import ControllerCRUD from "../../core/Controller"
import { FailureResponse, SuccessResponse } from "../../core/response/ResponseHandler"
import UserManager from "../../utils/UserManager"
import LearnerForm from "../../models/register/LearnerForm"
import { logger } from "../../utils/log/logger"
import LearnerFormToMemberMapper from "../../utils/mapper/register/LearnerFormToMemberMapper"
import TokenManager from "../../utils/token/TokenManager"
import LearnerRegisterFromValidator from "../../utils/validator/register/LearnerRegisterFormValidator"
import { isEmpty } from "../../core/extension/CommonExtension"
import ErrorExceptionToFailureResponseMapper from "../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"
import Member from "../../models/member/Member"
import FileManager from "../../utils/FileManager"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import LearnerRepository from "../../repository/LearnerRepostitory"
import MemberUpdateForm from "../../models/member/MemberUpdateForm"
import LearnerFormToUpdateMemberMapper from "../../utils/mapper/register/LearnerFromToUpdateMemberMapper"
import HttpStatusCode from "../../core/constant/HttpStatusCode"
import { launch } from "../../core/extension/launch"
import LearnerFormModel from "../../models/register/data/LearnerFormModel"

class LearnerController extends ControllerCRUD {
    private readonly databaseConnection: DatabaseConnection = new DatabaseConnection()
    private readonly learnerRepository: LearnerRepository = new LearnerRepository(this.databaseConnection)

    create(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const data: LearnerForm = new LearnerFormModel(req.body)
            const validator = new LearnerRegisterFromValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) return next(new FailureResponse("Register data is invalid", HttpStatusCode.HTTP_400_BAD_REQUEST, validate.error))

            let userId

            try {
                if (req.file === undefined) return next(new FailureResponse("Please upload image file", HttpStatusCode.HTTP_404_NOT_FOUND))

                // create firebase user
                const user = await UserManager.createUser(data)
                // change register form to member detail
                const inputData: Member = LearnerFormToMemberMapper(data)
                inputData["id"] = user["uid"]
                userId = user["uid"]

                // set profile image path
                const fileManager = new FileManager()
                const filePath = await fileManager.convertImageToProfile(req.file.path, userId)
                inputData["profileUrl"] = filePath

                // insert learner data to database
                await this.learnerRepository.insertLearner(inputData)

                const token = TokenManager.generateToken({
                    id: inputData["id"],
                    email: inputData["email"],
                    username: inputData["username"],
                    role: inputData["role"]
                })
                return next(new SuccessResponse(token))
            } catch (error) {
                logger.error(error)
                if (Object.values(FileErrorType).includes(error["type"])) {
                    const fileManager = new FileManager()
                    fileManager.deleteFile(req.file.path)
                    return next(ErrorExceptionToFailureResponseMapper(error, HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR))
                }
                if (userId !== null && userId !== undefined) {
                    UserManager.deleteUser(userId)
                }
                return next(new FailureResponse(error["message"], HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, error))
            }
        }, next)
    }

    read(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const idParam = req.params.id

            if (!idParam.isSafeNotNull()) return next(new FailureResponse("Can not find user id", HttpStatusCode.HTTP_404_NOT_FOUND))

            try {
                const learnerData = await this.learnerRepository.getLearnerProfile(idParam)

                if (isEmpty(learnerData)) return next(new SuccessResponse("Can not find user"))

                return next(new SuccessResponse(learnerData))
            } catch (err) {
                logger.error(err)
                return next(new FailureResponse("Can not get user from database", HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, err))
            }
        }, next)
    }

    update(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const idParam: string = req.params.id
            const data: LearnerForm = new LearnerFormModel(req.body)
            const validator = new LearnerRegisterFromValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) return next(new FailureResponse("Register data is invalid", HttpStatusCode.HTTP_400_BAD_REQUEST, validate.error))

            try {
                const learnerData = await this.learnerRepository.getLearnerProfile(idParam)
                if (isEmpty(learnerData)) return next(new FailureResponse("Can not find user", HttpStatusCode.HTTP_404_NOT_FOUND))

                const updateData: MemberUpdateForm = LearnerFormToUpdateMemberMapper(data, learnerData["profileUrl"])

                const file = req.file

                if (file !== undefined) {
                    const fileManager = new FileManager()
                    const filePath = await fileManager.convertImageToProfile(file.path, idParam)
                    updateData["profileUrl"] = filePath
                }

                // update user email if change email
                if (learnerData["email"] !== updateData["email"]) {
                    await UserManager.editUserEmail(idParam, updateData["email"])
                }

                // update member data
                await this.learnerRepository.editLearnerProfile(idParam, updateData)

                const learner = await this.learnerRepository.getLearnerProfile(idParam)

                const token = TokenManager.generateToken({
                    id: learner["id"],
                    email: learner["email"],
                    username: learner["username"],
                    role: learner["role"]
                })
                return next(new SuccessResponse(token))
            } catch (err) {
                logger.error(err)
                return next(new FailureResponse(err["message"], HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, err))
            }
        }, next)
    }

    delete(req: Request, res: Response, next: NextFunction) {
        launch(async () => {
            const idParam: string = req.params.id

            if (!idParam.isSafeNotNull()) return next(new FailureResponse("Can not find user id", HttpStatusCode.HTTP_404_NOT_FOUND))

            try {
                const learnerData = await this.learnerRepository.getLearnerProfile(idParam)
                if (isEmpty(learnerData)) return next(new FailureResponse("Can not find user", HttpStatusCode.HTTP_404_NOT_FOUND))

                // delete user from firebase
                const result = await UserManager.deleteUser(idParam)
                if (!result) return next(new FailureResponse("Cannot delete user from firebase"))

                // delete user from database
                await this.learnerRepository.deleteLearner(idParam)

                // delete user profile
                const fileManager = new FileManager()
                const userImageProfile = learnerData["profileUrl"]
                if (userImageProfile !== null && userImageProfile !== undefined) {
                    fileManager.deleteFile(userImageProfile)
                }

                return next(new SuccessResponse(null))
            } catch (error) {
                logger.error(error)
                return next(new FailureResponse(error["message"], HttpStatusCode.HTTP_500_INTERNAL_SERVER_ERROR, error))
            }
        }, next)
    }
}

export default LearnerController