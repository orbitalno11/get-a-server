import DatabaseConnection from "../configs/DatabaseConnection"
import Database from "../core/constant/Database"
import UserRole from "../core/constant/UserRole"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import DatabaseErrorType from "../core/exceptions/model/DatabaseErrorType"
import { isEmpty } from "../core/extension/CommonExtension"
import Contact from "../models/Contact"
import Member from "../models/member/Member"
import MemberUpdateForm from "../models/member/MemberUpdateForm"
import { logger } from "../utils/log/logger"
import MemberToArrayMapper from "../utils/mapper/query/MemberToArrayMapper"
import MemberUpdateFromToArrayMapper from "../utils/mapper/query/MemberUpdateFormToArrayMapper"

class TutorRepository {
    private connection: DatabaseConnection

    constructor(conn: DatabaseConnection) {
        this.connection = conn
    }

    async insertTutor(data: Member, subject: Array<number>) {
        try {
            const insertMemberCommand = `INSERT INTO ${Database.MEMBER_TABLE} (member_id, firstname, lastname, gender, dateOfBirth, profileUrl, email, username, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            const insertMemberRoleCommand = `INSERT INTO ${Database.MEMBER_ROLE_TABLE} (role_id, member_id) VALUES (?, ?)`
            const insertMemberInterestedSubject = `INSERT INTO ${Database.INTERESTED_SUBJECT_TABLE} (subject_rank, member_id, subject_id) VALUES (?, ?, ?)`
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

    async getTutorProfile(id: string): Promise<Member> {
        try {
            const sqlCommand = `SELECT member_id, firstname, lastname, gender, dateOfBirth, profileUrl,
                                email, username, created, updated, role_id 
                                FROM ${Database.MEMBER_TABLE} NATURAL JOIN ${Database.MEMBER_ROLE_TABLE}
                                WHERE member_id like ?`
            const memberData = await this.connection.query(sqlCommand, id)
            return memberData[0]
        } catch (err) {
            logger.error(err)
            throw new ErrorExceptions("Cannot get tutor data", DatabaseErrorType.SELECT_ERROR)
        }
    }

    async editTutorProfile(id: string, data: MemberUpdateForm, contact: Contact, intruduction: string | null) {
        try {
            const updateMemberCommand = `UPDATE ${Database.MEMBER_TABLE} SET 
                                        firstname =?, lastname =?, gender =?, dateOfBirth =?,
                                        profileUrl =?, email =?, username =?, updated =?
                                        WHERE member_id like ?`
            await this.connection.beginTransaction()
            await this.connection.query(updateMemberCommand, MemberUpdateFromToArrayMapper(id, data))
            await this.updateTutorContact(id, contact)
            await this.updateTutorIntroduction(id, intruduction)
            await this.connection.commit()
        } catch (err) {
            logger.error(err)
            await this.connection.rollback()
            throw new ErrorExceptions("Cannot edit tutor profile", DatabaseErrorType.UPDATE_ERROR)
        }
    }

    async getTutorContact(id: string): Promise<Contact> {
        try {
            const sqlCommand = `SELECT phone_number, line_id, facebook_url FROM ${Database.CONTACT_TABLE} WHERE member_id like ?`
            const contact = await this.connection.query(sqlCommand, [id])
            return contact[0]
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot get tutor contact from database", DatabaseErrorType.SELECT_ERROR)
        }
    }

    async getTutorIntroduction(id: string): Promise<string> {
        try {
            const sqlCommand = `SELECT introduction FROM ${Database.SELF_INTRUDUCTION_TABLE} WHERE member_id like ?`
            const contact = await this.connection.query(sqlCommand, [id])
            return contact[0]
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot get tutor introduction from database", DatabaseErrorType.SELECT_ERROR)
        }
    }

    private async updateTutorContact(id:string, contact: Contact): Promise<void> {
        try {
            const contactData = await this.getTutorContact(id)
            if (isEmpty(contactData)) {
                const sqlCommand = `INSERT INTO ${Database.CONTACT_TABLE} (member_id, phone_number, line_id, facebook_url) VALUES (?, ?, ?, ?)`
                await this.connection.query(sqlCommand, [id, contact["phoneNumber"], contact["lineId"], contact["facebookUrl"]])
            } else {
                const updateContactCommand = `UPDATE ${Database.CONTACT_TABLE} SET phone_number =?, line_id =?, facebook_url =? WHERE member_id like ?`
                await this.connection.query(updateContactCommand, [contact["phoneNumber"], contact["lineId"], contact["facebookUrl"], id])
            }
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot update tutor contact", DatabaseErrorType.UPDATE_ERROR)
        }
    }

    private async updateTutorIntroduction(id: string, introduction: string | null): Promise<void> {
        try {
            const introductionData = await this.getTutorIntroduction(id)
            if (!introductionData.isSafeNotNull()) {
                const sqlCommand = `INSERT INTO ${Database.SELF_INTRUDUCTION_TABLE} (member_id, introduction) VALUES (?, ?)`
                if (introduction?.isSafeNotNull()) {
                    await this.connection.query(sqlCommand, [id, introduction])
                }
            } else {
                const updateIntroductionCommand = `UPDATE ${Database.SELF_INTRUDUCTION_TABLE} SET introduction =? WHERE member_id like ?`
                if (introduction?.isSafeNotNull()) {
                    await this.connection.query(updateIntroductionCommand, [introduction, id])
                }
            }
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot update tutor introduction", DatabaseErrorType.UPDATE_ERROR)
        }
    }

}

export default TutorRepository