import { HttpStatus, Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { v4 as uuid } from "uuid"
import { logger } from "../../../core/logging/Logger"
import { InterestedSubjectEntity } from "../../../entity/member/interestedSubject.entity"
import { SubjectEntity } from "../../../entity/common/subject.entity"
import TutorForm from "../../../model/form/register/TutorForm"
import TokenManager from "../../../utils/token/TokenManager"
import UserUtil from "../../../utils/UserUtil"
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
import PublicProfile from "../../../model/profile/PublicProfile"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { TutorEntityToPublicProfileMapper } from "../../../utils/mapper/tutor/TutorEntityToPublicProfile.mapper"
import { TutorError } from "../../../core/exceptions/constants/tutor-error.enum"
import SimpleOfflineCourse from "../../../model/course/SimpleOfflineCourse"
import { isNotEmpty } from "../../../core/extension/CommonExtension"
import { OfflineCourseEntityToSimpleCourseListMapper } from "../../../utils/mapper/course/offline/OfflineCourseEntityToSimpleCourse.mapper"
import { ImageSize } from "../../../core/constant/ImageSize.enum"
import Document from "../../../model/common/Document"
import OnlineCourse from "../../../model/course/OnlineCourse"
import { OnlineCourseEntityToOnlineCourseMapper } from "../../../utils/mapper/course/online/OnlineCourseEntityToOnlineCourse.mapper"

/**
 * Service for tutor controller
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class TutorService {
    constructor(
        private connection: Connection,
        private readonly userManager: UserUtil,
        private readonly tokenManager: TokenManager,
        private readonly fileStorageUtils: FileStorageUtils,
        private readonly repository: TutorRepository
    ) {
    }

    /**
     * Create tutor profile
     * @param data
     * @param file
     */
    async createTutor(data: TutorForm, file: Express.Multer.File): Promise<string> {
        let userId: string
        let filePath: string
        try {
            // create firebase user
            const user = await this.userManager.createFirebaseUser(data)
            // change register form to member detail
            userId = user.uid

            // set profile image path
            filePath = await this.fileStorageUtils.uploadImageTo(file, userId, "profile")

            const interestedSubject = this.getInterestedSubjectArray(data)

            const result = await this.repository.createTutor(userId, data, filePath, interestedSubject)

            // generate token
            return this.tokenManager.generateToken({
                id: result.id,
                email: result.email,
                username: result.username,
                profileUrl: result.profileUrl,
                role: UserRole.TUTOR,
                verified: false
            })
        } catch (error) {
            logger.error(error)
            if (userId) {
                await this.userManager.deleteFirebaseUser(userId)
            }
            if (filePath) {
                await this.fileStorageUtils.deleteFileFromUrl(filePath)
            }
            throw error
        }
    }

    /**
     * Create interested subject entity object array
     * @param params
     * @private
     */
    private getInterestedSubjectArray(params: TutorForm): Array<InterestedSubjectEntity> {
        const interestedSubjects = []
        interestedSubjects.push(this.getInterestedSubjectEntity(params.subject1, 1))
        if (params.subject2?.isSafeNotBlank()) {
            interestedSubjects.push(this.getInterestedSubjectEntity(params.subject2, 2))
            if (params.subject3?.isSafeNotBlank()) {
                interestedSubjects.push(this.getInterestedSubjectEntity(params.subject3, 3))
            }
        }
        return interestedSubjects
    }

    /**
     * Create interested subject entity object
     * @param param
     * @param rank
     * @private
     */
    private getInterestedSubjectEntity(param: Subject, rank: number): InterestedSubjectEntity {
        const subject = new SubjectEntity()
        subject.code = param
        const interested = new InterestedSubjectEntity()
        interested.subject = subject
        interested.subjectRank = rank
        return interested
    }

    /**
     * Get public tutor profile
     * @param id
     */
    async getProfileById(id: string): Promise<PublicProfile> {
        return launch(async () => {
            const profile = await this.repository.getPublicProfile(TutorProfile.getTutorId(id))

            if (isEmpty(profile)) {
                logger.error("Can not found profile")
                throw ErrorExceptions.create("Can not found profile", TutorError.CAN_NOT_GET_PROFILE)
            }

            return new TutorEntityToPublicProfileMapper().map(profile)
        })
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
            if (educations) {
                return new EducationEntityToEducationMapper().toEducationArray(educations)
            } else {
                return []
            }
        })
    }

    /**
     * Tutor request education verification
     * @param user
     * @param data
     * @param files
     */
    async requestEducationVerification(user: User, data: EducationVerifyForm, files: Document[]): Promise<string> {
        let fileUrl: Document[] = []
        try {
            for (const file of files) {
                file.url = await this.fileStorageUtils.uploadImageTo(file.file, user.id, "verify-edu", ImageSize.A4_WIDTH_VERTICAL_PX, ImageSize.A4_HEIGHT_VERTICAL_PX)
                fileUrl.push(file)
            }
            const requestId = uuid()

            await this.repository.createEducationVerification(requestId, user, data, fileUrl)

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (isNotEmpty(fileUrl)) {
                for (const url of fileUrl) {
                    await this.fileStorageUtils.deleteFileFromUrl(url.url)
                }
            }
            throw error
        }
    }

    /**
     * Tutor update education verification
     * @param educationId
     * @param user
     * @param data
     * @param files
     */
    async updateEducationVerification(educationId: string, user: User, data: EducationVerifyForm, files?: Document[]) {
        let fileUrl: Document[] = []
        let oldFileUrl: Document[] = []
        try {
            const verificationData = await this.checkEducationOwner(educationId, user)

            if (isNotEmpty(files)) {
                for (const file of files) {
                    file.url = await this.fileStorageUtils.uploadImageTo(file.file, user.id, "verify-edu", ImageSize.A4_WIDTH_VERTICAL_PX, ImageSize.A4_HEIGHT_VERTICAL_PX)
                    fileUrl.push(file)
                    if (file.name === "doc1") {
                        oldFileUrl.push(Document.create(null, verificationData.documentUrl1))
                    }
                    if (file.name === "doc2") {
                        oldFileUrl.push(Document.create(null, verificationData.documentUrl2))
                    }
                    if (file.name === "doc3") {
                        oldFileUrl.push(Document.create(null, verificationData.documentUrl3))
                    }
                }
            }

            await this.repository.updateEducationVerificationData(verificationData.id, educationId, user, data, fileUrl)

            if (isNotEmpty(oldFileUrl)) {
                for (const url of oldFileUrl) {
                    await this.fileStorageUtils.deleteFileFromUrl(url.url)
                }
            }

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (isNotEmpty(fileUrl) && isNotEmpty(oldFileUrl)) {
                for (const url of fileUrl) {
                    await this.fileStorageUtils.deleteFileFromUrl(url.url)
                }
            }
            throw error
        }
    }

    /**
     * Delete education verification data
     * @param educationId
     * @param user
     */
    async deleteEducation(educationId: string, user: User) {
        return launch(async () => {
            const verificationData = await this.checkEducationOwner(educationId, user)
            await this.repository.deleteEducationVerification(verificationData.id, educationId)

            const { documentUrl1, documentUrl2, documentUrl3 } = verificationData
            if (documentUrl1?.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(documentUrl1)
            }
            if (documentUrl2?.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(documentUrl2)
            }
            if (documentUrl3?.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(documentUrl3)
            }
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
            if (testings) {
                return new ExamResultEntityToExamResultMapper().toExamResultArray(testings)
            } else {
                return []
            }
        })
    }

    /**
     * Get testing with verification data
     * @param id
     * @param user
     */
    getTesting(id: string, user: User): Promise<TestingVerification | null> {
        return launch(async () => {
            const tutorId = TutorProfile.getTutorId(user.id)
            const testing = await this.repository.getTesting(id, tutorId)
            if (testing) {
                return UserVerifyToTestingMapper(testing)
            } else {
                return null
            }
        })
    }

    /**
     * Tutor request testing verification
     * @param user
     * @param data
     * @param files
     */
    async createTestingVerificationData(user: User, data: TestingVerifyForm, files: Document[]): Promise<string> {
        let fileUrl: Document[] = []
        try {
            for (const file of files) {
                file.url = await this.fileStorageUtils.uploadImageTo(file.file, user.id, "verify-edu", ImageSize.A4_WIDTH_VERTICAL_PX, ImageSize.A4_HEIGHT_VERTICAL_PX)
                fileUrl.push(file)
            }
            const requestId = uuid()

            await this.repository.createTestingVerificationData(requestId, user, data, fileUrl)

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (isNotEmpty(fileUrl)) {
                for (const url of fileUrl) {
                    await this.fileStorageUtils.deleteFileFromUrl(url.url)
                }
            }
            throw error
        }
    }

    /**
     * Update testing verification data
     * @param testingId
     * @param user
     * @param data
     * @param files
     */
    async updateTestingVerificationData(testingId: string, user: User, data: TestingVerifyForm, files?: Document[]): Promise<string> {
        let fileUrl: Document[] = []
        let oldFileUrl: Document[] = []
        try {
            const verificationData = await this.checkTestingOwner(testingId, user)

            if (isNotEmpty(files)) {
                for (const file of files) {
                    file.url = await this.fileStorageUtils.uploadImageTo(file.file, user.id, "verify-edu", ImageSize.A4_WIDTH_VERTICAL_PX, ImageSize.A4_HEIGHT_VERTICAL_PX)
                    fileUrl.push(file)
                    if (file.name === "doc1") {
                        oldFileUrl.push(Document.create(null, verificationData.documentUrl1))
                    }
                    if (file.name === "doc2") {
                        oldFileUrl.push(Document.create(null, verificationData.documentUrl2))
                    }
                    if (file.name === "doc3") {
                        oldFileUrl.push(Document.create(null, verificationData.documentUrl3))
                    }
                }
            }

            await this.repository.updateTestingVerificationData(verificationData.id, testingId, user, data, fileUrl)

            if (isNotEmpty(oldFileUrl)) {
                for (const url of oldFileUrl) {
                    await this.fileStorageUtils.deleteFileFromUrl(url.url)
                }
            }

            return "Successful"
        } catch (error) {
            logger.error(error)
            if (isNotEmpty(fileUrl) && isNotEmpty(oldFileUrl)) {
                for (const url of fileUrl) {
                    await this.fileStorageUtils.deleteFileFromUrl(url.url)
                }
            }
            throw error
        }
    }

    /**
     * Delete testing verification data
     * @param testingId
     * @param user
     */
    deleteTestingVerificationData(testingId: string, user: User) {
        return launch(async () => {
            const verificationData = await this.checkTestingOwner(testingId, user)
            await this.repository.deleteTestingVerificationData(testingId, verificationData.id)

            const { documentUrl1, documentUrl2, documentUrl3 } = verificationData
            if (documentUrl1?.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(documentUrl1)
            }
            if (documentUrl2?.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(documentUrl2)
            }
            if (documentUrl3?.isSafeNotBlank()) {
                await this.fileStorageUtils.deleteFileFromUrl(documentUrl3)
            }
        })
    }

    /**
     * Check request user is an owner
     * @param testingId
     * @param user
     * @private
     */
    private async checkTestingOwner(testingId: string, user: User): Promise<UserVerifyEntity> {
        try {
            const verificationData = await this.repository.getTesting(testingId, TutorProfile.getTutorId(user.id))
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
     * Get tutor offline course
     * @param userId
     * @param user
     */
    getOfflineCourse(userId: string, user?: User): Promise<SimpleOfflineCourse[]> {
        return launch(async () => {
            const isOwner = userId === user?.id
            const tutorId = TutorProfile.getTutorId(userId)
            let result = isOwner ? await this.repository.getOfflineCourseTutor(tutorId) : await this.repository.getOfflineCourse(tutorId)
            return isNotEmpty(result) ? OfflineCourseEntityToSimpleCourseListMapper(result, isOwner) : []
        })
    }

    /**
     * Get tutor online course
     * @param userId
     * @param user
     */
    getOnlineCourse(userId: string, user?: User): Promise<OnlineCourse[]> {
        return launch(async () => {
            const courses = await this.repository.getOnlineCourse(TutorProfile.getTutorId(userId))
            return isNotEmpty(courses) ? new OnlineCourseEntityToOnlineCourseMapper().mapList(courses) : []
        })
    }
}
