import { Request, Response, NextFunction } from "express"
import DatabaseConnection from "../../configs/DatabaseConnection"

// controller
import ControllerCRUD from "../../core/Controller"

// handle result
import { FailureResponse, SuccessResponse } from "../../core/response/ResponseHandler"
import UserManager from "../../utils/UserManager"
import { DatabaseTable } from "../../models/constant/Database"
import UserRole from "../../models/constant/UserRole"
import LearnerForm from "../../models/form/register/LearnerForm"
import Learner from "../../models/Learner"
import { logger } from "../../utils/log/logger"
import LearnerFormToLearnerMapper from "../../utils/mapper/register/LearnerFormToLearnerMapper"
import TokenManager from "../../utils/token/TokenManager"
import LearnerRegisterFromValidator from "../../utils/validator/register/LearnerRegisterFromValidator"
import LearnerToArrayMapper from "../../utils/mapper/query/LearnerToArrayMapper"
import UserErrorType from "../../core/exceptions/model/UserErrorType"
import { isEmpty } from "../../core/extension/CommonExtension"
import UploadImageMiddleware from "../../middlewares/multer/UploadImage"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import UploadFileErrorType from "../../core/exceptions/model/UploadFileErrorType"
import ErrorExceptionToFailureResponseMapper from "../../utils/mapper/error/ErrorExceptionsToFailureResponseMapper"

class LearnerController extends ControllerCRUD {
    private readonly table: string = DatabaseTable.MEMBER_TABLE

    async create(req: Request, res: Response, next: NextFunction) {
        const data: LearnerForm = req.body
        const validate = new LearnerRegisterFromValidator(data).validate()

        if (!validate.valid) {
            return next(new FailureResponse("Register data is invalid", 400, validate.error))
        }

        // setup database connection
        const connection = new DatabaseConnection()

        let userId

        try {
            // create firebase user
            const user = await UserManager.createUser(data)
            // change register form to leaner detail
            const inputData: Learner = LearnerFormToLearnerMapper(data)
            inputData['id'] = user['uid']
            userId = user['uid']

            // insert learner data to database
            const insertMemberCommand = `INSERT INTO ${DatabaseTable.MEMBER_TABLE} (member_id, firstname, lastname, gender, dateOfBirth, address1, address2, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const insertMemberRoleCommand = `INSERT INTO ${DatabaseTable.MEMBER_ROLE_TABLE} (role_id, member_id) VALUES (?, ?)`
            await connection.beginTransaction()
            await connection.query(insertMemberCommand, LearnerToArrayMapper(inputData))
            await connection.query(insertMemberRoleCommand, [UserRole.LEARNER, userId])
            await connection.commit()
            const token = TokenManager.generateSimpleProfileTokenData({
                id: inputData['id'],
                email: inputData["email"],
                username: inputData["username"],
                role: UserRole.LEARNER
            })
            return next(new SuccessResponse<String | null>(token))
        } catch (err) {
            logger.error(err)
            if (err instanceof ErrorExceptions) {
                if (err["type"] === UserErrorType.EMAIL_ALREDY_EXITS) {
                    return next(ErrorExceptionToFailureResponseMapper(err, 500))
                }
            }
            if (userId !== null && userId !== undefined) {
                UserManager.deleteUser(userId)
            }
            await connection.rollback()
            return next(new FailureResponse("Can not create user", 500, err))
        }
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        const idParam = req.params.id

        if (!idParam) return next(new FailureResponse("Can not find user id", 404))

        try {
            const db = new DatabaseConnection()
            const sqlCommand = `SELECT  member_id, firstname, lastname, gender, dateOfBirth, 
                                address1, address2, email, username, created, updated, role_id 
                                FROM ${DatabaseTable.MEMBER_TABLE} NATURAL JOIN ${DatabaseTable.MEMBER_ROLE_TABLE} 
                                WHERE member_id like ?`
            const memberData = await db.query(sqlCommand, idParam)

            if (isEmpty(memberData)) return next(new SuccessResponse("Can not find user"))

            return next(new SuccessResponse(memberData))
        } catch (err) {
            return next(new FailureResponse("Can not get user from database", 500, err))
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const uploadMiddleware = new UploadImageMiddleware()
            const upload = uploadMiddleware.uploadImage2Mb("learner")
            await upload(req, res)
            if (req.file === undefined) {
                return next(new FailureResponse("Please upload image file"))
            }
            return next(new SuccessResponse("Upload"))
        } catch (err) {
            logger.error(err)
            if (err instanceof ErrorExceptions) {
                return next(ErrorExceptionToFailureResponseMapper(err, 500))
            }
            return next(new FailureResponse(err["message"]))
        }
    }
    
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> { }
}

export default LearnerController