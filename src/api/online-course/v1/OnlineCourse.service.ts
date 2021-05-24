import { HttpStatus, Injectable } from "@nestjs/common"
import OnlineCourseRepository from "../../../repository/OnlineCourseRepository"
import OnlineCourseForm from "../../../model/course/OnlineCourseForm"
import User from "../../../model/User"
import UserUtil from "../../../utils/UserUtil"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import { logger } from "../../../core/logging/Logger"
import { isEmpty, isNotEmpty } from "../../../core/extension/CommonExtension"
import { v4 as uuidV4 } from "uuid"
import { CourseType } from "../../../model/course/data/CourseType"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"
import AnalyticManager from "../../../analytic/AnalyticManager"
import TutorProfile from "../../../model/profile/TutorProfile"
import OnlineCourse from "../../../model/course/OnlineCourse"
import { launch } from "../../../core/common/launch"
import { OnlineCourseEntityToOnlineCourseMapper } from "../../../utils/mapper/course/online/OnlineCourseEntityToOnlineCourse.mapper"
import FailureResponse from "../../../core/response/FailureResponse"
import { ImageSize } from "../../../core/constant/ImageSize.enum"

/**
 * Service class for "v1/online-course"
 * @see OnlineCourseController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class OnlineCourseService {
    constructor(
        private readonly repository: OnlineCourseRepository,
        private readonly userUtil: UserUtil,
        private readonly fileStorageUtil: FileStorageUtils,
        private readonly analytic: AnalyticManager
    ) {
    }

    /**
     * Create online course
     * @param data
     * @param file
     * @param user
     */
    async createOnlineCourse(data: OnlineCourseForm, file: Express.Multer.File, user: User): Promise<string> {
        let coverUrl = ""
        try {
            if (isNotEmpty(file)) {
                coverUrl = await this.fileStorageUtil.uploadImageTo(
                    file,
                    user.id,
                    "online-course",
                    ImageSize.A4_WIDTH_VERTICAL_PX,
                    ImageSize.A4_HEIGHT_VERTICAL_PX
                )
                data.coverUrl = coverUrl
            }
            const courseId = this.generateCourseId(data)
            const tutor = await this.userUtil.getTutor(user.id)

            if (isNotEmpty(tutor)) {
                await this.repository.createOnlineCourse(courseId, data, tutor)
            } else {
                throw ErrorExceptions.create("You are not a tutor", UserError.DO_NOT_HAVE_PERMISSION)
            }

            await this.analytic.trackCreateOnlineCourse(TutorProfile.getTutorId(user.id))

            return courseId
        } catch (error) {
            logger.error(error)
            if (coverUrl.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFileFromUrl(coverUrl)
            }
            if (error instanceof error) throw error
            throw ErrorExceptions.create("Can not create online course", CourseError.CAN_NOT_CREATE_COURSE)
        }
    }

    /**
     * Generate online course id
     * @param data
     * @private
     */
    private generateCourseId(data: OnlineCourseForm): string {
        return `${data.subject}-${CourseType.ONLINE}-${data.grade}-${uuidV4()}`
    }

    /**
     * Get Online course by id
     * @param courseId
     */
    getOnlineCourseById(courseId: string): Promise<OnlineCourse> {
        return launch(async () => {
            const course = await this.repository.getOnlineCourseById(courseId)
            return isNotEmpty(course) ? new OnlineCourseEntityToOnlineCourseMapper().map(course) : null
        })
    }

    /**
     * Update online course
     * @param courseId
     * @param data
     * @param user
     * @param file
     */
    async updateOnlineCourse(courseId: string, data: OnlineCourseForm, user: User, file?: Express.Multer.File): Promise<string> {
        let coverUrl = ""
        let oldCoverUrl = ""
        try {
            const course = await this.repository.getOnlineCourseById(courseId)

            if (user.id !== course.owner?.member?.id) {
                logger.error("Do not have permission")
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.UNAUTHORIZED)
            }

            if (isEmpty(course)) {
                logger.error("Can not found course data")
                throw FailureResponse.create(CourseError.CAN_NOT_FOUND_COURSE)
            }

            if (isNotEmpty(file)) {
                coverUrl = await this.fileStorageUtil.uploadImageTo(
                    file,
                    user.id,
                    "online-course",
                    ImageSize.A4_WIDTH_VERTICAL_PX,
                    ImageSize.A4_HEIGHT_VERTICAL_PX
                )
                oldCoverUrl = course.coverUrl
                data.coverUrl = coverUrl
            }

            await this.repository.updateOnlineCourse(courseId, data, course.owner)

            if (oldCoverUrl.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFileFromUrl(oldCoverUrl)
            }

            return courseId
        } catch (error) {
            logger.error(error)
            if (coverUrl.isSafeNotBlank() && oldCoverUrl.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFileFromUrl(coverUrl)
            }
            if (error instanceof error || error instanceof FailureResponse) throw error
            throw ErrorExceptions.create("Can not update online course", CourseError.CAN_NOT_UPDATE)
        }
    }
}