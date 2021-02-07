import DatabaseConnection from "../configs/DatabaseConnection"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import DatabaseErrorType from "../core/exceptions/model/DatabaseErrorType"
import Database from "../core/constant/Database"
import UserRole from "../core/constant/UserRole"
import Member from "../models/member/Member"
import MemberUpdateForm from "../models/member/MemberUpdateForm"
import { logger } from "../utils/log/logger"
import MemberToArrayMapper from "../utils/mapper/query/MemberToArrayMapper"
import MemberUpdateFromToArrayMapper from "../utils/mapper/query/MemberUpdateFormToArrayMapper"

class LearnerRepository {
    private connection: DatabaseConnection

    constructor(conn: DatabaseConnection) {
        this.connection = conn
    }

    async insertLearner(data: Member) {
        try {
            const insertMemberCommand = `INSERT INTO ${Database.MEMBER_TABLE} (member_id, firstname, lastname, gender, dateOfBirth, profileUrl, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const insertMemberRoleCommand = `INSERT INTO ${Database.MEMBER_ROLE_TABLE} (role_id, member_id) VALUES (?, ?)`
            await this.connection.beginTransaction()
            await this.connection.query(insertMemberCommand, MemberToArrayMapper(data))
            await this.connection.query(insertMemberRoleCommand, [UserRole.LEARNER, data["id"]])
            await this.connection.commit()
        } catch (err) {
            logger.error(err)
            await this.connection.rollback()
            throw new ErrorExceptions("Cannot insert learner data", DatabaseErrorType.INSERT_ERROR)
        }
    }
    
    async getLearnerProfile(id: string): Promise<Member> {
        try {
            const sqlCommand = `SELECT member_id, firstname, lastname, gender, dateOfBirth, profileUrl,
                                email, username, created, updated, role_id 
                                FROM ${Database.MEMBER_TABLE} NATURAL JOIN ${Database.MEMBER_ROLE_TABLE} 
                                WHERE member_id like ?`
            const memberData = await this.connection.query(sqlCommand, id)
            return memberData[0]
        } catch (err) {
            logger.error(err)
            throw new ErrorExceptions("Cannot get learner data", DatabaseErrorType.SELECT_ERROR)
        }
    }

    async editLearnerProfile(id: string, data: MemberUpdateForm) {
        try{
            const sqlCommand = `UPDATE ${Database.MEMBER_TABLE} SET 
                                firstname =?, lastname =?, gender =?, dateOfBirth =?,
                                profileUrl =?, email =?, username =?, updated =?
                                WHERE member_id =?`
            await this.connection.beginTransaction()
            await this.connection.query(sqlCommand, MemberUpdateFromToArrayMapper(id, data))
            await this.connection.commit()
        } catch (err) {
            logger.error(err)
            await this.connection.rollback()
            throw new ErrorExceptions("Cannot edit leaner profile", DatabaseErrorType.UPDATE_ERROR)
        }
    }

    async deleteLearner(id: string) {
        try {
            const deleteMemberRoleRecord = `DELETE FROM ${Database.MEMBER_ROLE_TABLE} WHERE member_id like ?`
            const deleteMemberRecord = `DELETE FROM ${Database.MEMBER_TABLE} WHERE member_id like ?`
            this.connection.beginTransaction()
            this.connection.query(deleteMemberRoleRecord, [id])
            this.connection.query(deleteMemberRecord, [id])
            this.connection.commit()
        } catch (error) {
            logger.error(error)
            this.connection.rollback()
            throw new ErrorExceptions("Can not delete learner", DatabaseErrorType.DELETE_ERROR)
        }
    }

}

export default LearnerRepository