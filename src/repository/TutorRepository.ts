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
import { LocationType } from "../model/location/data/LocationType"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import TutorForm from "../model/form/register/TutorForm"
import TutorFormToMemberEntityMapper from "../utils/mapper/tutor/TutorFormToMemberEntityMapper"
import { MemberRoleEntity } from "../entity/member/memberRole.entitiy"
import { UserRole } from "../core/constant/UserRole"
import { RoleEntity } from "../entity/common/role.entity"
import { ContactEntity } from "../entity/contact/contact.entitiy"
import { InterestedSubjectEntity } from "../entity/member/interestedSubject.entity"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticRecencyEntity } from "../entity/analytic/TutorAnalyticRecency.entity"
import { TutorAnalyticFrequencyEntity } from "../entity/analytic/TutorAnalyticFrequency.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import { GradeEntity } from "../entity/common/grade.entity"
import Document from "../model/common/Document"

/**
 * Repository for "v1/tutor"
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
class TutorRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Create tutor profile
     * @param userId
     * @param data
     * @param pictureUrl
     * @param interestedSubject
     */
    async createTutor(
        userId: string,
        data: TutorForm,
        pictureUrl: string,
        interestedSubject: InterestedSubjectEntity[]
    ): Promise<MemberEntity> {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const member = TutorFormToMemberEntityMapper(data)
            member.id = userId
            member.profileUrl = pictureUrl
            member.verified = false
            member.created = new Date()
            member.updated = new Date()

            const memberRole = new MemberRoleEntity()
            memberRole.role = RoleEntity.createFromId(UserRole.TUTOR)

            const contact = new ContactEntity()
            contact.phoneNumber = data.phoneNumber

            const tutorProfile = new TutorEntity()
            tutorProfile.id = TutorProfile.getTutorId(userId)
            tutorProfile.contact = contact
            tutorProfile.introduction = "ยินดีที่ได้รู้จักทุกคน"

            member.memberRole = memberRole
            member.tutorProfile = tutorProfile
            member.interestedSubject = interestedSubject

            const statistic = this.getTutorStatisticEntity(tutorProfile)
            const recencyAnalytic = this.getTutorAnalyticRecencyEntity(tutorProfile)
            const frequencyAnalytic = this.getTutorAnalyticFrequencyEntity(tutorProfile)
            const monetaryAnalytic = this.getTutorAnalyticMonetaryEntity(tutorProfile)

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(contact)
            await queryRunner.manager.save(member)
            await queryRunner.manager.save(statistic)
            await queryRunner.manager.save(recencyAnalytic)
            await queryRunner.manager.save(frequencyAnalytic)
            await queryRunner.manager.save(monetaryAnalytic)
            await queryRunner.commitTransaction()

            return member
        } catch (error) {
            console.log(error)
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create tutor profile", TutorError.CAN_NOT_CREATE_TUTOR_PROFILE)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get public profile data
     * @param tutorId
     */
    async getPublicProfile(tutorId: string): Promise<TutorEntity> {
        try {
            return await this.connection.createQueryBuilder(TutorEntity, "tutor")
                .leftJoinAndSelect("tutor.member", "member")
                .leftJoinAndSelect("tutor.statistic", "statistic")
                .leftJoinAndSelect("member.memberAddress", "address")
                .leftJoinAndSelect("member.interestedSubject", "interestedSubject")
                .leftJoinAndSelect("interestedSubject.subject", "subject")
                .leftJoinAndSelect("address.subDistrict", "subDistrict")
                .leftJoinAndSelect("address.district", "district")
                .leftJoinAndSelect("address.province", "province")
                .where("tutor.id like :tutorId", { tutorId: tutorId })
                .andWhere("address.type = :addressType", { addressType: LocationType.CONVENIENCE })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor profile", TutorError.CAN_NOT_GET_PROFILE)
        }
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
                .leftJoinAndSelect("education.grade", "grade")
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
                    .leftJoinAndSelect("education.grade", "grade")
                    .leftJoinAndSelect("education.verifiedData", "verify")
                    .where("education.tutor like :id", { "id": id })
                    .orderBy("verify.updated", "DESC")
                    .getMany()
            } else {
                return await this.connection.createQueryBuilder(EducationHistoryEntity, "education")
                    .leftJoinAndSelect("education.institute", "institute")
                    .leftJoinAndSelect("education.branch", "branch")
                    .leftJoinAndSelect("education.grade", "grade")
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
     */
    async createEducationVerification(requestId: string, user: User, data: EducationVerifyForm, fileUrl: Document[]) {
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
    async updateEducationVerificationData(requestId: string, educationId: string, user: User, data: EducationVerifyForm, fileUrl: Document[]) {
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
    async createTestingVerificationData(requestId: string, user: User, data: TestingVerifyForm, fileUrl: Document[]) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.TESTING_RESULT, fileUrl)

            const testingHistory = this.getTestingHistoryEntity(user.id, data)
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
     * Update testing verification data
     * @param requestId
     * @param testingId
     * @param user
     * @param data
     * @param fileUrl
     */
    async updateTestingVerificationData(
        requestId: string,
        testingId: string,
        user: User,
        data: TestingVerifyForm,
        fileUrl: Document[]
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const userVerify = this.getUserVerifyEntity(requestId, user, UserVerify.TESTING_RESULT, fileUrl, true)

            const testingHistory = this.getTestingHistoryEntity(user.id, data, testingId)
            testingHistory.verifiedData = userVerify

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(testingHistory)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update verification", TutorError.CAN_NOT_UPDATE_TESTING_HISTORY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Delete testing verification data
     * @param testingId
     * @param requestId
     */
    async deleteTestingVerificationData(testingId: string, requestId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const userVerify = new UserVerifyEntity()
            userVerify.id = requestId

            const testingHistory = new TestingHistoryEntity()
            testingHistory.id = testingId.toNumber()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.remove(testingHistory)
            await queryRunner.manager.remove(userVerify)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not delete verification", TutorError.CAN_NOT_DELETE_TESTING_HISTORY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get tutor offline course order by rating
     * @param tutorId
     */
    async getOfflineCourse(tutorId: string): Promise<OfflineCourseEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseEntity, "offlineCourse")
                .leftJoinAndSelect("offlineCourse.courseType", "courseType")
                .leftJoinAndSelect("offlineCourse.subject", "subject")
                .leftJoinAndSelect("offlineCourse.grade", "grade")
                .leftJoinAndSelect("offlineCourse.rating", "rating")
                .where("offlineCourse.owner like :tutorId", { tutorId: tutorId })
                .orderBy("rating.rating", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get offline course", TutorError.CAN_NOT_GET_TUTOR_OFFLINE_COURSE)
        }
    }

    /**
     * Get tutor offline course order by learner request number
     * @param tutorId
     */
    async getOfflineCourseTutor(tutorId: string): Promise<OfflineCourseEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseEntity, "offlineCourse")
                .leftJoinAndSelect("offlineCourse.courseType", "courseType")
                .leftJoinAndSelect("offlineCourse.subject", "subject")
                .leftJoinAndSelect("offlineCourse.grade", "grade")
                .leftJoinAndSelect("offlineCourse.rating", "rating")
                .leftJoinAndSelect("offlineCourse.courseType", "type")
                .where("offlineCourse.owner like :tutorId", { tutorId: tutorId })
                .orderBy("offlineCourse.requestNumber", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get offline course", TutorError.CAN_NOT_GET_TUTOR_OFFLINE_COURSE)
        }
    }

    /**
     * Create user verify entity object
     * @param requestId
     * @param user
     * @param type
     * @param docs
     * @param isUpdate
     * @private
     */
    private getUserVerifyEntity(
        requestId: string,
        user: User,
        type: UserVerify,
        docs: Document[],
        isUpdate: boolean = false
    ): UserVerifyEntity {
        const member = new MemberEntity()
        member.id = user.id

        const entity = new UserVerifyEntity()
        entity.id = requestId
        entity.member = member
        entity.type = type

        for (const doc of docs) {
            if (doc.name === "doc1") {
                entity.documentUrl1 = doc.url
            }
            if (doc.name === "doc2") {
                entity.documentUrl2 = doc.url
            }
            if (doc.name === "doc3") {
                entity.documentUrl3 = doc.url
            }
        }

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
    private getEducationHistoryEntity(userId: string, data: EducationVerifyForm, educationId?: string): EducationHistoryEntity {
        const tutor = new TutorEntity()
        tutor.id = TutorProfile.getTutorId(userId)

        const branch = new BranchEntity()
        branch.id = data.branch

        const institute = new InstituteEntity()
        institute.id = data.institute

        const grade = new GradeEntity()
        grade.grade = data.grade

        const educationHistory = new EducationHistoryEntity()
        if (educationId?.isSafeNotBlank()) {
            educationHistory.id = educationId.toNumber()
        }
        educationHistory.tutor = tutor
        educationHistory.branch = branch
        educationHistory.institute = institute
        educationHistory.gpax = data.gpax
        educationHistory.grade = grade
        educationHistory.status = data.status
        educationHistory.verified = RequestStatus.WAITING

        return educationHistory
    }

    /**
     * Create testing history entity object
     * @param userId
     * @param data
     * @param testingId
     * @private
     */
    private getTestingHistoryEntity(userId: string, data: TestingVerifyForm, testingId?: string): TestingHistoryEntity {
        const tutor = new TutorEntity()
        tutor.id = TutorProfile.getTutorId(userId)

        const exam = new ExamTypeEntity()
        exam.id = data.examId

        const subject = new SubjectEntity()
        subject.code = data.subjectCode

        const testingHistory = new TestingHistoryEntity()
        if (testingId?.isSafeNotBlank()) {
            testingHistory.id = testingId.toNumber()
        }
        testingHistory.tutor = tutor
        testingHistory.exam = exam
        testingHistory.subject = subject
        testingHistory.testingScore = data.score
        testingHistory.year = data.year.toString()
        testingHistory.verified = RequestStatus.WAITING

        return testingHistory
    }

    /**
     * Create tutor statistic entity object
     * @param tutor
     * @private
     */
    private getTutorStatisticEntity(tutor: TutorEntity): TutorStatisticEntity {
        const statistic = new TutorStatisticEntity()
        statistic.tutor = tutor
        statistic.offlineCourseNumber = 0
        statistic.onlineCourseNumber = 0
        statistic.numberOfLearner = 0
        statistic.numberOfFavorite = 0
        statistic.numberOfOfflineReview = 0
        statistic.numberOfOnlineReview = 0
        statistic.offlineCourseRank = 0
        statistic.onlineCourseRank = 0
        statistic.rating = 0
        statistic.offlineRating = 0
        statistic.onlineRating = 0
        return statistic
    }

    /**
     * Create tutor recency analytic entity object
     * @param tutor
     * @private
     */
    private getTutorAnalyticRecencyEntity(tutor: TutorEntity): TutorAnalyticRecencyEntity {
        const analytic = new TutorAnalyticRecencyEntity()
        analytic.tutor = tutor
        analytic.recentLogin = new Date()
        return analytic
    }

    /**
     * Create tutor frequency analytic entity object
     * @param tutor
     * @private
     */
    private getTutorAnalyticFrequencyEntity(tutor: TutorEntity): TutorAnalyticFrequencyEntity {
        const analytic = new TutorAnalyticFrequencyEntity()
        analytic.tutor = tutor
        analytic.numberOfLogin = 0
        analytic.numberOfCourseView = 0
        analytic.numberOfProfileView = 0
        return analytic
    }

    /**
     * Create tutor monetary analytic entity object
     * @param tutor
     * @private
     */
    private getTutorAnalyticMonetaryEntity(tutor: TutorEntity): TutorAnalyticMonetaryEntity {
        const analytic = new TutorAnalyticMonetaryEntity()
        analytic.tutor = tutor
        analytic.rating = 0
        analytic.offlineRating = 0
        analytic.onlineRating = 0
        analytic.numberOfLearner = 0
        analytic.numberOfFavorite = 0
        analytic.numberOfOfflineReview = 0
        analytic.numberOfOnlineReview = 0
        return analytic
    }
}

export default TutorRepository