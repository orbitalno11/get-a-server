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
import UserErrorType from "../../core/exception/model/UserErrorType"

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
            const sqlCommand = "INSERT INTO member (id, firstname, lastname, gender, dateOfBirth, address1, address2, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            await connection.beginTransaction()
            await connection.query(sqlCommand, LearnerToArrayMapper(inputData))
            await connection.commit()
            const token = TokenManager.generateSimpleProfileTokenData({
                userId: user['uid'],
                role: UserRole.LEARNER
            })
            return next(new SuccessResponse<String | null>(token))
        } catch (err) {
            logger.error(err)
            if (err['data'] === UserErrorType.EMAIL_ALREDY_EXITS) {
                return next(new FailureResponse(err['message']['message'], 500))
            }
            if (userId !== null && userId !== undefined) {
                UserManager.deleteUser(userId)
            }
            await connection.rollback()
            return next(new FailureResponse("Can not create user", 500, err))
        }
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        return next(new SuccessResponse("Hello"))
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> { }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> { }
}

export default LearnerController