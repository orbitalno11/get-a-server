import { auth } from "firebase-admin"
import DatabaseConnection from "../configs/DatabaseConnection"
import { authentication } from "../configs/firebase/FirebaseConfig"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserErrorType from "../core/exceptions/model/UserErrorType"
import Database from "../core/constant/Database"
import LearnerForm from "../models/register/LearnerForm"
import User from "../models/common/User"
import { logger } from "./log/logger"
import Register from "../models/register/Register"

class UserManager {
    public static async createUser(registerData: Register): Promise<auth.UserRecord> {
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
            const sqlCommand = `SELECT member_id, username, email, role_id FROM ${Database.MEMBER_TABLE} NATURAL JOIN ${Database.MEMBER_ROLE_TABLE} WHERE member_id like ?`
            const record = await db.query(sqlCommand, userId)
            const basicUser: User = record[0]
            return basicUser
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Can not find user", UserErrorType.CAN_NOT_FIND_USER)
        }
    }

    public static async editUserEmail(userId: string, newEmail: string): Promise<auth.UserRecord> {
        try {
            return await authentication.updateUser(userId, {
                email: newEmail
            })
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot update user email", UserErrorType.CANNOT_UPDATE_USER_EMAIL)
        }
    }

    public static async deleteUser(userId: string): Promise<boolean> {
        try {
            await authentication.deleteUser(userId)
            return true
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot delete user", UserErrorType.CANNOT_DELETE_USER)
        }
    }
}

export default UserManager