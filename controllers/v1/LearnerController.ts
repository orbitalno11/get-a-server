import { Request, Response, NextFunction } from "express"
import { v4 as uuid } from "uuid"
import DatabaseConnection from "../../configs/DatabaseConnection"

// controller
import ControllerCRUD from "../../core/Controller"

// handle result
import { FailureResponse, SuccessResponse } from "../../core/response/ResponseHandler"
import UserManager from "../../core/UserManager"
import Database from "../../models/constant/Database"
import LearnerForm from "../../models/form/register/LearnerForm"
import Learner from "../../models/Learner"
import { logger } from "../../utils/log/logger"
import LearnerFormToLearnerMapper from "../../utils/mapper/register/LearnerFormToLearnerMapper"
import LearnerRegisterFromValidator from "../../utils/validator/register/LearnerRegisterFromValidator"

class LearnerController extends ControllerCRUD {
    private readonly table: string = Database.MEMBER_TABLE

    async create(req: Request, res: Response, next: NextFunction) {
        const data: LearnerForm = req.body
        const validate = new LearnerRegisterFromValidator(data).validate()

        if (!validate.valid) {
            return next(new FailureResponse("Register data is invalid", 400, validate.error))
        }

        // create firebase user
        const user = await UserManager.createUser(data)
        try {
            // change register form to leaner detail
            const inputData: Learner = LearnerFormToLearnerMapper(data)
            inputData['id'] = user['uid']

            // setup database connection
            const connection = new DatabaseConnection().getConnection()

            // insert learner data to database
            const sqlCommand = "INSERT INTO member (id, firstname, lastname, gender, dateOfBirth, address1, address2, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            await connection.query(sqlCommand, inputData)
            logger.info(inputData)
            next(new SuccessResponse<Learner>(inputData))
        } catch (err) {
            logger.error(err)
            UserManager.deleteUser(user['uid'])
        }
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> { }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> { }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> { }
}

export default LearnerController