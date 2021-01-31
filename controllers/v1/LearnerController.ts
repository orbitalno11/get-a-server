import { Request, Response, NextFunction } from "express"
import DatabaseConnection from "../../configs/DatabaseConnection"

// controller
import ControllerCRUD from "../../core/Controller"

// handle result
import { FailureResponse, SuccessResponse } from "../../core/response/ResponseHandler"
import UserManager from "../../utils/UserManager"
import { DatabaseTable } from "../../models/constant/Database"
import LearnerForm from "../../models/form/register/LearnerForm"
import { logger } from "../../utils/log/logger"
import LearnerFormToMemberMapper from "../../utils/mapper/register/LearnerFormToMemberMapper"
import TokenManager from "../../utils/token/TokenManager"
import LearnerRegisterFromValidator from "../../utils/validator/register/LearnerRegisterFromValidator"
import { isEmpty } from "../../core/extension/CommonExtension"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import ErrorExceptionToFailureResponseMapper from "../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"
import Member from "../../models/member/Member"
import FileManager from "../../utils/FileManager"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import LearnerRepository from "../../data/LearnerRepostitory"
import MemberUpdateForm from "../../models/member/MemberUpdateForm"
import LearnerFormToUpdateMemberMapper from "../../utils/mapper/register/LearnerFromToUpdateMemberMapper"
import { isSafeNotNull } from "../../core/extension/StringExtension"

class LearnerController extends ControllerCRUD {
    private readonly table: string = DatabaseTable.MEMBER_TABLE
    private readonly databaseConnection: DatabaseConnection = new DatabaseConnection()
    private readonly learnerRepository: LearnerRepository = new LearnerRepository(this.databaseConnection)

    async create(req: Request, res: Response, next: NextFunction) {
        const data: LearnerForm = req.body
        const validate = new LearnerRegisterFromValidator(data).validate()

        if (!validate.valid) return next(new FailureResponse("Register data is invalid", 400, validate.error))

        let userId

        try {
            if (req.file === undefined) return next(new FailureResponse("Please upload image file", 404))

            // create firebase user
            const user = await UserManager.createUser(data)
            // change register form to member detail
            const inputData: Member = LearnerFormToMemberMapper(data)
            inputData["id"] = user["uid"]
            inputData["profileUrl"] = req.file.path
            userId = user["uid"]

            // insert learner data to database
            await this.learnerRepository.insertLearner(inputData)
            
            const token = TokenManager.generateSimpleProfileTokenData({
                id: inputData["id"],
                email: inputData["email"],
                username: inputData["username"],
                role: inputData["role"]
            })
            return next(new SuccessResponse(token))
        } catch (err) {
            logger.error(err)
            if (err instanceof ErrorExceptions) {
                const type = err["type"]
                if (type !== FileErrorType.CAN_NOT_CREATE_DIRECTORY || type !== FileErrorType.FILE_NOT_ALLOW || type !== FileErrorType.FILE_SIZE_IS_TOO_LARGE) {
                    FileManager.deleteFile(req.file.path)
                }
                return next(ErrorExceptionToFailureResponseMapper(err, 500))
            }
            if (userId !== null && userId !== undefined) {
                UserManager.deleteUser(userId)
            }
            return next(new FailureResponse("Can not create user", 500, err))
        }
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        const idParam = req.params.id

        if (!isSafeNotNull(idParam)) return next(new FailureResponse("Can not find user id", 404))

        try {
            const learnerData = await this.learnerRepository.getLearnerProfile(idParam)

            if (isEmpty(learnerData)) return next(new SuccessResponse("Can not find user"))

            return next(new SuccessResponse(learnerData))
        } catch (err) {
            return next(new FailureResponse("Can not get user from database", 500, err))
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const idParam: string = req.params.id
        const data: LearnerForm = req.body
        const validate = new LearnerRegisterFromValidator(data).validate()

        if (!validate.valid) return next(new FailureResponse("Register data is invalid", 400, validate.error))

        try {
            const learnerData = await this.learnerRepository.getLearnerProfile(idParam)
            if (isEmpty(learnerData)) return next(new FailureResponse("Can not find user", 400))
            
            const updateData: MemberUpdateForm = LearnerFormToUpdateMemberMapper(data, learnerData["profileUrl"])

            const file = req.file

            if (file !== undefined) {
                updateData["profileUrl"] = file.path
            }

            // update user email if change email
            if (learnerData["email"] !== updateData["email"]) {
                await UserManager.editUserEmail(idParam, updateData["email"])
            }

            // update member data
            await this.learnerRepository.editLearnerProfile(idParam, updateData)

            const learner = await this.learnerRepository.getLearnerProfile(idParam)

            const token = TokenManager.generateSimpleProfileTokenData({
                id: learner["id"],
                email: learner["email"],
                username: learner["username"],
                role: learner["role"]
            })
            return next(new SuccessResponse(token))
        } catch (err) {
            logger.error(err)
            if (err instanceof ErrorExceptions) {
                return next(ErrorExceptionToFailureResponseMapper(err, 500))
            }
            return next(new FailureResponse(err))
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const idParam: string = req.params.id

        if (!isSafeNotNull(idParam)) return next(new FailureResponse("Can not find user id", 404))

        try {
            const result = await UserManager.deleteUser(idParam)
            if (!result) return next(new FailureResponse("Cannot delete user from firebase"))
            
            await this.learnerRepository.deleteLearner(idParam)

            return next(new SuccessResponse(null))
        } catch (error) {
            logger.error(error)
            return next(new FailureResponse(error))
        }
     }
}

export default LearnerController