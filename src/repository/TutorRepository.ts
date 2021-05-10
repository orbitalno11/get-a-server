import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { TutorError } from "../core/exceptions/constants/tutor-error.enum"
import EducationVerifyForm from "../model/education/EducationVerifyForm"
import User from "../model/User"
import { EducationHistoryEntity } from "../entity/education/educationHistory.entity"
import { TutorEntity } from "../entity/profile/tutor.entity"
import TutorProfile from "../model/profile/TutorProfile"
import { BranchEntity } from "../entity/education/branch.entity"
import { InstituteEntity } from "../entity/education/institute.entity"
import { UserVerifyEntity } from "../entity/UserVerify.entity"
import { MemberEntity } from "../entity/member/member.entitiy"
import { UserVerify } from "../model/common/data/UserVerify.enum"
import { RequestStatus } from "../model/common/data/RequestStatus"
import TestingVerifyForm from "../model/education/TestingVerifyForm"
import { ExamTypeEntity } from "../entity/education/examType.entity"
import { TestingHistoryEntity } from "../entity/education/testingHistory.entity"
import { SubjectEntity } from "../entity/common/subject.entity"

/**
 * Repository for "v1/tutor"
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
class TutorRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get education with verification data
     * @param id
     * @param tutorId
     */
    async getEducation(id: string, tutorId: string): Promise<UserVerifyEntity> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .leftJoinAndSelect("verify.educationHistory", "education")
                .leftJoinAndSelect("education.institute", "institute")
                .leftJoinAndSelect("education.branch", "branch")
                .where("education.id = :id", { "id": id })
                .andWhere("education.tutor like :tutorId", { "tutorId": tutorId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get education history", TutorError.CAN_NOT_GET_EDUCATION_HISTORY)
        }
    }

    /**
     * Get tutor education list
     * @param id
     * @param isOwner
     */
    async getEducations(id: string, isOwner: boolean): Promise<EducationHistoryEntity[]> {
        try {
            if (isOwner) {
                return await this.connection.createQueryBuilder(EducationHistoryEntity, "education")
                    .leftJoinAndSelect("education.institute", "institute")
                    .leftJoinAndSelect("education.branch", "branch")
                    .leftJoinAndSelect("education.verifiedData", "verify")
                    .where("education.tutor like :id", { "id": id })
                    .orderBy("verify.updated", "DESC")
                    .getMany()
            } else {
                return await this.connection.createQueryBuilder(EducationHistoryEntity, "education")
                    .leftJoinAndSelect("education.institute", "institute")
                    .leftJoinAndSelect("education.branch", "branch")
                    .leftJoinAndSelect("education.verifiedData", "verify")
                    .where("education.tutor like :id", { "id": id })
                    .andWhere("education.verified = :status", { "status": RequestStatus.APPROVE })
                    .orderBy("verify.updated", "DESC")
                    .getMany()
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get education history", TutorError.CAN_NOT_GET_EDUCATION_HISTORY)
        }
    }

    /**
     * Create education verification request
     * @param requestId
     * @param user
     * @param data
     * @param fileUrl
     * @param isUpdate
     */
    async createEducationVerification(requestId: string, user: User, data: EducationVerifyForm, fileUrl: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.EDUCATION, fileUrl)

            const educationHistory = this.getEducationHistoryEntity(user.id, data)
            educationHistory.verifiedData = userVerify

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(educationHistory)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not request verification", TutorError.CAN_NOT_REQUEST_VERIFY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Tutor update verification
     * @param requestId
     * @param educationId
     * @param user
     * @param data
     * @param fileUrl
     */
    async updateEducationData(requestId: string, educationId: string, user: User, data: EducationVerifyForm, fileUrl: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.EDUCATION, fileUrl, true)

            const educationHistory = this.getEducationHistoryEntity(user.id, data, educationId)
            educationHistory.verifiedData = userVerify

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(educationHistory)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update verification", TutorError.CAN_NOT_UPDATE_EDUCATION_HISTORY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Delete education verification data
     * @param requestId
     * @param educationId
     */
    async deleteEducationVerification(requestId: string, educationId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const userVerify = new UserVerifyEntity()
            userVerify.id = requestId

            const educationHistory = new EducationHistoryEntity()
            educationHistory.id = educationId.toNumber()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.remove(educationHistory)
            await queryRunner.manager.remove(userVerify)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not delete verification", TutorError.CAN_NOT_DELETE_EDUCATION_HISTORY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get testing with verification data
     * @param id
     * @param tutorId
     */
    async getTesting(id: string, tutorId: string): Promise<UserVerifyEntity> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .leftJoinAndSelect("verify.testingHistory", "testing")
                .leftJoinAndSelect("testing.subject", "subject")
                .leftJoinAndSelect("testing.exam", "exam")
                .where("testing.id = :id", { "id": id })
                .andWhere("testing.tutor like :tutorId", { "tutorId": tutorId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get education history", TutorError.CAN_NOT_GET_EDUCATION_HISTORY)
        }
    }

    /**
     * Get tutor testing list
     * @param id
     * @param isOwner
     */
    async getTestings(id: string, isOwner: boolean): Promise<TestingHistoryEntity[]> {
        try {
            if (isOwner) {
                return await this.connection.createQueryBuilder(TestingHistoryEntity, "testing")
                    .leftJoinAndSelect("testing.exam", "exam")
                    .leftJoinAndSelect("testing.subject", "subject")
                    .leftJoinAndSelect("testing.verifiedData", "verify")
                    .where("testing.tutor like :id", { "id": id })
                    .orderBy("verify.updated", "DESC")
                    .getMany()
            } else {
                return await this.connection.createQueryBuilder(TestingHistoryEntity, "testing")
                    .leftJoinAndSelect("testing.exam", "exam")
                    .leftJoinAndSelect("testing.subject", "subject")
                    .leftJoinAndSelect("testing.verifiedData", "verify")
                    .where("testing.tutor like :id", { "id": id })
                    .andWhere("testing.verified = :status", { "status": RequestStatus.APPROVE })
                    .orderBy("verify.updated", "DESC")
                    .getMany()
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get testing history", TutorError.CAN_NOT_GET_TESTING_HISTORY)
        }
    }

    /**
     * Create testing verification request
     * @param requestId
     * @param user
     * @param data
     * @param fileUrl
     */
    async requestTestingVerify(requestId: string, user: User, data: TestingVerifyForm, fileUrl: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const tutor = new TutorEntity()
            tutor.id = TutorProfile.getTutorId(user.id)

            const exam = new ExamTypeEntity()
            exam.id = data.examId

            const subject = new SubjectEntity()
            subject.code = data.subjectCode

            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.TESTING_RESULT, fileUrl)

            const testingHistory = new TestingHistoryEntity()
            testingHistory.tutor = tutor
            testingHistory.exam = exam
            testingHistory.subject = subject
            testingHistory.testingScore = data.score
            testingHistory.year = data.year.toString()
            testingHistory.verified = RequestStatus.WAITING
            testingHistory.verifiedData = userVerify

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(testingHistory)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not request verification", TutorError.CAN_NOT_REQUEST_VERIFY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Create user verify entity object
     * @param requestId
     * @param user
     * @param type
     * @param doc1Url
     * @param isUpdate
     * @private
     */
    private getUserVerifyEntity(
        requestId: string,
        user: User,
        type: UserVerify,
        doc1Url: string,
        isUpdate: boolean = false
    ): UserVerifyEntity {
        const member = new MemberEntity()
        member.id = user.id

        const entity = new UserVerifyEntity()
        entity.id = requestId
        entity.member = member
        entity.type = type
        entity.documentUrl1 = doc1Url

        if (!isUpdate) {
            entity.created = new Date()
        }

        return entity
    }

    /**
     * Create education history entity object
     * @param userId
     * @param data
     * @param educationId
     * @private
     */
    private getEducationHistoryEntity(userId: string, data: EducationVerifyForm, educationId?: string) {
        const tutor = new TutorEntity()
        tutor.id = TutorProfile.getTutorId(userId)

        const branch = new BranchEntity()
        branch.id = data.branch

        const institute = new InstituteEntity()
        institute.id = data.institute

        const educationHistory = new EducationHistoryEntity()
        if (educationId?.isSafeNotBlank()) {
            educationHistory.id = educationId.toNumber()
        }
        educationHistory.tutor = tutor
        educationHistory.branch = branch
        educationHistory.institute = institute
        educationHistory.gpax = data.gpax
        educationHistory.status = data.status
        educationHistory.verified = RequestStatus.WAITING

        return educationHistory
    }
}

export default TutorRepository