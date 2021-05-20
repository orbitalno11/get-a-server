import { Injectable } from "@nestjs/common"
import OnlineCourseRepository from "../../../repository/OnlineCourseRepository"
import OnlineCourseForm from "../../../model/course/OnlineCourseForm"
import User from "../../../model/User"
import UserUtil from "../../../utils/UserUtil"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import { logger } from "../../../core/logging/Logger"
import { isNotEmpty } from "../../../core/extension/CommonExtension"
import { v4 as uuidV4 } from "uuid"
import { CourseType } from "../../../model/course/data/CourseType"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"

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
        private readonly fileStorageUtil: FileStorageUtils
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
                coverUrl = await this.fileStorageUtil.uploadImageTo(file, user.id, "online-course")
                data.coverUrl = coverUrl
            }
            const courseId = this.generateCourseId(data)
            const tutor = await this.userUtil.getTutor(user.id)

            if (isNotEmpty(tutor)) {
                await this.repository.createOnlineCourse(courseId, data, tutor)
            } else {
                throw ErrorExceptions.create("You are not a tutor", UserError.DO_NOT_HAVE_PERMISSION)
            }

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
}