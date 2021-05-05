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
     * Create education verification request
     * @param requestId
     * @param user
     * @param data
     * @param fileUrl
     */
    async requestEducationVerify(requestId: string, user: User, data: EducationVerifyForm, fileUrl: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const tutor = new TutorEntity()
            tutor.id = TutorProfile.getTutorId(user.id)

            const branch = new BranchEntity()
            branch.id = data.branch

            const institute = new InstituteEntity()
            institute.id = data.institute

            const educationHistory = new EducationHistoryEntity()
            educationHistory.tutor = tutor
            educationHistory.branch = branch
            educationHistory.institute = institute
            educationHistory.gpax = data.gpax
            educationHistory.status = data.status
            educationHistory.verified = RequestStatus.WAITING

            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.EDUCATION ,fileUrl)

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(educationHistory)
            await queryRunner.manager.save(userVerify)
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

            const testingHistory = new TestingHistoryEntity()
            testingHistory.tutor = tutor
            testingHistory.exam = exam
            testingHistory.subject = subject
            testingHistory.testingScore = data.score
            testingHistory.year = data.year.toString()
            testingHistory.verified = RequestStatus.WAITING

            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.TESTING_RESULT, fileUrl)

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(testingHistory)
            await queryRunner.manager.save(userVerify)
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
     * @param doc2Url
     * @param doc3Url
     * @private
     */
    private getUserVerifyEntity(
        requestId: string,
        user: User,
        type: UserVerify,
        doc1Url: string,
        doc2Url?: string,
        doc3Url?: string
    ): UserVerifyEntity {
        const member = new MemberEntity()
        member.id = user.id

        const entity = new UserVerifyEntity()
        entity.id = requestId
        entity.member = member
        entity.type = type
        entity.documentUrl1 = doc1Url
        entity.documentUrl2 = doc2Url ? doc2Url : null
        entity.documentUrl3 = doc3Url ? doc3Url : null
        return entity
    }
}

export default TutorRepository