import DatabaseConnection from "../configs/DatabaseConnection"
import Database from "../core/constant/Database"
import UserRole from "../core/constant/UserRole"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import DatabaseErrorType from "../core/exceptions/model/DatabaseErrorType"
import Member from "../models/member/Member"
import { logger } from "../utils/log/logger"
import MemberToArrayMapper from "../utils/mapper/query/MemberToArrayMapper"

class TutorRepository {
    private connection: DatabaseConnection

    constructor(conn: DatabaseConnection) {
        this.connection = conn
    }

    async insertTutor(data: Member, subject: Array<number>) {
        try {
            const insertMemberCommand = `INSERT INTO ${Database.MEMBER_TABLE} (member_id, firstname, lastname, gender, dateOfBirth, profileUrl, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const insertMemberRoleCommand = `INSERT INTO ${Database.MEMBER_ROLE_TABLE} (role_id, member_id) VALUES (?, ?)`
            const insertMemberInterestedSubject = `INSERT INTO ${Database.INTERESTED_SUBJECT_TABLE} (rank, member_id, subject_id) VALUES (?, ?, ?)`
            await this.connection.beginTransaction()
            await this.connection.query(insertMemberCommand, MemberToArrayMapper(data))
            await this.connection.query(insertMemberRoleCommand, [UserRole.TUTOR, data["id"]])
            for (let index = 0; index < subject.length; index++) {
                await this.connection.query(insertMemberInterestedSubject, [(index + 1), data["id"], subject[index]])
            }
            await this.connection.commit()
        } catch (err) {
            logger.error(err)
            await this.connection.rollback()
            throw new ErrorExceptions("Cannot insert tutor data", DatabaseErrorType.INSERT_ERROR)
        }
    }

}

export default TutorRepository