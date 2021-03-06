import DatabaseConnection from "../configs/DatabaseConnection"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import DatabaseErrorType from "../core/exceptions/model/DatabaseErrorType"
import Database from "../core/constant/Database"
import UserRole from "../core/constant/UserRole"
import Member from "../models/member/Member"
import MemberUpdateForm from "../models/member/MemberUpdateForm"
import MemberToArrayMapper from "../utils/mapper/query/MemberToArrayMapper"
import MemberUpdateFromToArrayMapper from "../utils/mapper/query/MemberUpdateFormToArrayMapper"
import Repository from "./Repository"

class LearnerRepository extends Repository {

    constructor(conn: DatabaseConnection) {
        super(conn)
    }

    async insertLearner(data: Member) {
        return this.launch<void>(async () => {
            const insertMemberCommand = `INSERT INTO ${Database.MEMBER_TABLE} (member_id, firstname, lastname, gender, dateOfBirth, profileUrl, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const insertMemberRoleCommand = `INSERT INTO ${Database.MEMBER_ROLE_TABLE} (role_id, member_id) VALUES (?, ?)`
            await this.connection.beginTransaction()
            await this.connection.query(insertMemberCommand, MemberToArrayMapper(data))
            await this.connection.query(insertMemberRoleCommand, [UserRole.LEARNER, data["id"]])
            await this.connection.commit()
        }, new ErrorExceptions("Cannot insert learner data", DatabaseErrorType.INSERT_ERROR))
    }
    
    async getLearnerProfile(id: string): Promise<Member> {
        return this.launch<Member>(async () => {
            const sqlCommand = `SELECT member_id, firstname, lastname, gender, dateOfBirth, profileUrl,
                                email, username, created, updated, role_id 
                                FROM ${Database.MEMBER_TABLE} NATURAL JOIN ${Database.MEMBER_ROLE_TABLE} 
                                WHERE member_id like ?`
            const memberData = await this.connection.query(sqlCommand, id)
            return memberData[0] as Member
        }, new ErrorExceptions("Cannot get learner data", DatabaseErrorType.SELECT_ERROR))
    }

    async editLearnerProfile(id: string, data: MemberUpdateForm) {
        return this.launch<void>(async () => {
            const sqlCommand = `UPDATE ${Database.MEMBER_TABLE} SET 
                                firstname =?, lastname =?, gender =?, dateOfBirth =?,
                                profileUrl =?, email =?, username =?, updated =?
                                WHERE member_id =?`
            await this.connection.beginTransaction()
            await this.connection.query(sqlCommand, MemberUpdateFromToArrayMapper(id, data))
            await this.connection.commit()
        }, new ErrorExceptions("Cannot edit leaner profile", DatabaseErrorType.UPDATE_ERROR))
    }

    async deleteLearner(id: string) {
        return this.launch<void>(async () => {
            const deleteMemberRoleRecord = `DELETE FROM ${Database.MEMBER_ROLE_TABLE} WHERE member_id like ?`
            const deleteMemberRecord = `DELETE FROM ${Database.MEMBER_TABLE} WHERE member_id like ?`
            this.connection.beginTransaction()
            this.connection.query(deleteMemberRoleRecord, [id])
            this.connection.query(deleteMemberRecord, [id])
            this.connection.commit()
        }, new ErrorExceptions("Can not delete learner", DatabaseErrorType.DELETE_ERROR))
    }

}

export default LearnerRepository