import { auth } from "firebase-admin"
import DatabaseConnection from "../configs/DatabaseConnection"
import { authentication } from "../configs/firebase/FirebaseConfig"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserErrorType from "../core/exceptions/model/UserErrorType"
import { DatabaseTable } from "../models/constant/Database"
import LearnerForm from "../models/form/register/LearnerForm"
import User from "../models/User"
import { logger } from "./log/logger"

class UserManager {
    public static async createUser(registerData: LearnerForm): Promise<auth.UserRecord> {
        try {
            return await authentication.createUser({
                email: registerData.email,
                password: registerData.password
            })
        } catch (error) {
            if (error['code'] === 'auth/email-already-exists') {
                throw new ErrorExceptions(error, UserErrorType.EMAIL_ALREDY_EXITS)
            }
            throw new ErrorExceptions("Can not create user", UserErrorType.CAN_NOT_CREATE_USER)
        }
    }

    public static async getUser(userId: string): Promise<User> {
        try {
            const db = new DatabaseConnection()
            const sqlCommand = `SELECT member_id, username, email, role_id FROM ${DatabaseTable.MEMBER_TABLE} NATURAL JOIN ${DatabaseTable.MEMBER_ROLE_TABLE} WHERE member_id like ?`
            const record = await db.query(sqlCommand, userId)
            const basicUser: User = record[0]
            return basicUser
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Can not find user", UserErrorType.CAN_NOT_FIND_USER)
        }
    }

    public static async deleteUser(userId: string): Promise<void> {
        try {
            return await authentication.deleteUser(userId)
        } catch (error) {
            return error
        }
    }
}

export default UserManager