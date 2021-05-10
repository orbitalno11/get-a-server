import { HttpStatus, Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { v4 as uuid } from "uuid"
import { logger } from "../../../core/logging/Logger"
import { InterestedSubjectEntity } from "../../../entity/member/interestedSubject.entity"
import { MemberRoleEntity } from "../../../entity/member/memberRole.entitiy"
import { RoleEntity } from "../../../entity/common/role.entity"
import { SubjectEntity } from "../../../entity/common/subject.entity"
import TutorForm from "../../../model/form/register/TutorForm"
import TutorFormToMemberEntityMapper from "../../../utils/mapper/tutor/TutorFormToMemberEntityMapper"
import TokenManager from "../../../utils/token/TokenManager"
import UserManager from "../../../utils/UserManager"
import { TutorEntity } from "../../../entity/profile/tutor.entity"
import { ContactEntity } from "../../../entity/contact/contact.entitiy"
import { Subject } from "../../../model/common/data/Subject"
import { UserRole } from "../../../core/constant/UserRole"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import EducationVerifyForm from "../../../model/education/EducationVerifyForm"
import TutorRepository from "../../../repository/TutorRepository"
import User from "../../../model/User"
import TestingVerifyForm from "../../../model/education/TestingVerifyForm"
import { launch } from "../../../core/common/launch"
import { EducationEntityToEducationMapper } from "../../../utils/mapper/common/EducationEntityToEducationMapper"
import Education from "../../../model/education/Education"
import TutorProfile from "../../../model/profile/TutorProfile"
import EducationVerification from "../../../model/education/EducationVerification"
import { UserVerifyToEducationMapper } from "../../../utils/mapper/verify/UserVerifyToEducation.mapper"
import { ExamResultEntityToExamResultMapper } from "../../../utils/mapper/common/ExamResultEntityToExamResultMapper"
import ExamResult from "../../../model/education/ExamResult"
import TestingVerification from "../../../model/education/TestingVerification"
import { UserVerifyToTestingMapper } from "../../../utils/mapper/verify/UserVerifyToTesting.mapper"
import FailureResponse from "../../../core/response/FailureResponse"
import { VerificationError } from "../../../core/exceptions/constants/verification-error.enum"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { UserVerifyEntity } from "../../../entity/UserVerify.entity"

/**
 * Service for tutor controller
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class TutorService {
    constructor(
        private connection: Connection,
        private readonly userManager: UserManager,
        private readonly tokenManager: TokenManager,
        private readonly fileStorageUtils: FileStorageUtils,
        private readonly repository: TutorRepository
    ) {
    }

    async createTutor(data: TutorForm, file: Express.Multer.File): Promise<string> {
        let userId: string
        let filePath: string
        try {
            // create firebase user
            const user = await this.userManager.createUser(data)
            // change register form to member detail
            userId = user.uid

            // set profile image path
            filePath = await this.fileStorageUtils.uploadImageTo(file, userId, "profile")

            // create entity
            const member = TutorFormToMemberEntityMapper(data)
            member.id = userId
            member.profileUrl = filePath
            member.verified = false
            member.created = new Date()
            member.updated = new Date()

            const memberRole = new MemberRoleEntity()
            memberRole.member = member
            memberRole.role = RoleEntity.createFromId(UserRole.TUTOR)

            member.memberRole = memberRole

            // create update-profile profile
            const tutorProfile = new TutorEntity()

            const contact = new ContactEntity()
            contact.phoneNumber = data.phoneNumber

            tutorProfile.id = `tutor-${userId}`
            tutorProfile.contact = contact
            tutorProfile.introduction = "ยินดีที่ได้รู้จักทุกคน"
            member.tutorProfile = tutorProfile

            const subject = this.getInterestedSubjectArray(data)
            for (let index = 0; index < subject.length; index++) {
                const interestedSubjectEntity = new InterestedSubjectEntity()
                interestedSubjectEntity.subjectRank = index + 1
                interestedSubjectEntity.subject = SubjectEntity.createFromCode(subject[index])
                member.interestedSubject.push(interestedSubjectEntity)
            }

            // insert update-profile data to database
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(contact)
                await queryRunner.manager.save(member)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw error
            } finally {
                await queryRunner.release()
            }

            // generate token
            const token = this.tokenManager.generateToken({
                id: member.id,
                email: member.email,
                username: member.username,
                profileUrl: member.profileUrl,
                role: UserRole.TUTOR
            })

            return token
        } catch (error) {
            logger.error(error)
            if (userId) {
                await this.userManager.deleteUser(userId)
            }
            if (filePath) {
                await this.fileStorageUtils.deleteFileFromUrl(filePath)
            }
            throw error
        }
    }

    private getInterestedSubjectArray(params: TutorForm): Array<Subject> {
        const interestedSubject = [params["subject1"]]
        const subject2 = params["subject2"]
        if (subject2?.isSafeNotNull()) {
            interestedSubject.push(subject2)
            const subject3 = params["subject3"]
            if (subject3?.isSafeNotNull()) {
                interestedSubject.push(subject3)
            }
        }
        return interestedSubject
    }

    async getProfileById(id: string): Promise<TutorEntity> {
        try {
            return await this.connection.createQueryBuilder(TutorEntity, "tutor")
                .leftJoinAndSelect("tutor.member", "member")
                .leftJoinAndSelect("tutor.contact", "contact")
                .leftJoinAndSelect("member.memberAddress", "memberAddress") // TODO map address when system can insert address
                .where("tutor.id like :id")
                .setParameter("id", `tutor-${id}`)
                .getOne()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get education with verification data
     * @param id
     * @param user
     */
    getEducation(id: string, user: User): Promise<EducationVerification | null> {
        return launch(async () => {
            const tutorId = TutorProfile.getTutorId(user.id)
            const education = await this.repository.getEducation(id, tutorId)
            if (education) {
                return UserVerifyToEducationMapper(education)
            } else {
                return null
            }
        })
    }

    /**
     * Get tutor education list
     * @param id
     * @param user
     */
    getEducations(id: string, user?: User | null): Promise<Education[]> {
        return launch(async () => {
            const isOwner = id === user?.id
            const tutorId = TutorProfile.getTutorId(id)
            const educations = await this.repository.getEducations(tutorId, isOwner)
            return new EducationEntityToEducationMapper().toEducationArray(educations)
        })
    }

    /**
     * Tutor request education verification
     * @param user
     * @param data
     * @param file
     */
    async requestEducationVerification(user: User, data: EducationVerifyForm, file: Express.Multer.File): Promise<string> {
        let fileUrl = ""
        try {
            fileUrl = await this.fileStorageUtils.uploadImageTo(file, user.id, "verify-edu", 720, 1280)
            const requestId = uuid()

            await this.repository.createEducationVerification(requestId, user, data, fileUrl)

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (fileUrl.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(fileUrl)
            }
            throw error
        }
    }

    /**
     * Tutor update education verification
     * @param educationId
     * @param user
     * @param data
     * @param file
     */
    async updateEducationVerification(educationId: string, user: User, data: EducationVerifyForm, file?: Express.Multer.File) {
        let fileUrl = ""
        let oldFileUrl = ""
        try {
            const verificationData = await this.checkEducationOwner(educationId, user)

            if (file) {
                fileUrl = await this.fileStorageUtils.uploadImageTo(file, user.id, "verify-edu", 720, 1280)
                oldFileUrl = verificationData.documentUrl1
            } else {
                fileUrl = verificationData.documentUrl1
            }

            await this.repository.updateEducationData(verificationData.id, educationId, user, data, fileUrl)

            if (oldFileUrl.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(oldFileUrl)
            }

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (fileUrl.isSafeNotBlank() && oldFileUrl.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(fileUrl)
            }
            throw error
        }
    }

    /**
     * Delete education verification data
     * @param educationId
     * @param user
     */
    deleteEducation(educationId: string, user: User) {
        return launch(async () => {
            const verificationData = await this.checkEducationOwner(educationId, user)
            await this.repository.deleteEducationVerification(verificationData.id, educationId)
        })
    }

    /**
     * Check request user is an owner
     * @param educationId
     * @param user
     * @private
     */
    private async checkEducationOwner(educationId: string, user: User): Promise<UserVerifyEntity> {
        try {
            const verificationData = await this.repository.getEducation(educationId, TutorProfile.getTutorId(user.id))
            if (!verificationData) {
                logger.error("Can not found verification data")
                throw ErrorExceptions.create("Can not found verification data", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
            }

            if (verificationData.member?.id !== user.id) {
                logger.error("Permission Error")
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.FORBIDDEN)
            }
            return verificationData
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get tutor testing list
     * @param id
     * @param user
     */
    getTestings(id: string, user: User): Promise<ExamResult[]> {
        return launch(async () => {
            const isOwner = id === user?.id
            const tutorId = TutorProfile.getTutorId(id)
            const testings = await this.repository.getTestings(tutorId, isOwner)
            return new ExamResultEntityToExamResultMapper().toExamResultArray(testings)
        })
    }

    /**
     * Get testing with verification data
     * @param id
     * @param user
     */
    getTesting(id: string, user: User): Promise<TestingVerification> {
        return launch(async () => {
            const tutorId = TutorProfile.getTutorId(user.id)
            const testing = await this.repository.getTesting(id, tutorId)
            return UserVerifyToTestingMapper(testing)
        })
    }

    /**
     * Tutor request testing verification
     * @param user
     * @param data
     * @param file
     */
    async requestTestingVerify(user: User, data: TestingVerifyForm, file: Express.Multer.File): Promise<string> {
        let fileUrl = ""
        try {
            fileUrl = await this.fileStorageUtils.uploadImageTo(file, user.id, "verify-test", 720, 1280)
            const requestId = uuid()

            await this.repository.requestTestingVerify(requestId, user, data, fileUrl)

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (fileUrl.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(fileUrl)
            }
            throw error
        }
    }
}
