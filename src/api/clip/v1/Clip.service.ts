import { Injectable } from "@nestjs/common"
import ClipRepository from "../../../repository/ClipRepository"
import User from "../../../model/User"
import ClipForm from "../../../model/clip/ClipForm"
import { logger } from "../../../core/logging/Logger"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import UserUtil from "../../../utils/UserUtil"
import { isEmpty } from "../../../core/extension/CommonExtension"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { OnlineCourseEntity } from "../../../entity/course/online/OnlineCourse.entity"
import { OfflineCourseEntity } from "../../../entity/course/offline/offlineCourse.entity"
import UploadedFileProperty from "../../../model/common/UploadedFileProperty"
import { ClipError } from "../../../core/exceptions/constants/clip-error.enum"

/**
 * Service class for "v1/clip" controller
 * @see ClipController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class ClipService {
    constructor(
        private readonly repository: ClipRepository,
        private readonly userUtil: UserUtil,
        private readonly fileStorageUtil: FileStorageUtils
    ) {
    }

    /**
     * Create clip data
     * @param data
     * @param file
     * @param user
     */
    async createClip(data: ClipForm, file: Express.Multer.File, user: User) {
        let uploadedFile: UploadedFileProperty
        try {
            const course = await this.userUtil.getCourseOwn(user.id, data.courseId, false)
            const tutor = await this.userUtil.getTutor(user.id)

            if (isEmpty(course) || course instanceof OfflineCourseEntity) {
                logger.error("Do not have permission")
                throw ErrorExceptions.create("Do not have permission", UserError.DO_NOT_HAVE_PERMISSION)
            }

            const clipId = this.generateClipId(course)

            uploadedFile = await this.fileStorageUtil.uploadVideoFromLocalStorageTo(
                file,
                user.id,
                `online-course/${course.id}`
            )

            await this.repository.createClip(clipId, course, tutor, data, uploadedFile)

            return clipId
        } catch (error) {
            logger.error(error)
            if (uploadedFile?.path?.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFileFromPath(uploadedFile?.path)
            }
            throw ErrorExceptions.create("Can not create clip", ClipError.CAN_NOT_CREATE_CLIP)
        }
    }

    /**
     * Generate clip id
     * @param course
     * @private
     */
    private generateClipId(course: OnlineCourseEntity): string {
        return course.id + "-" + Date.now()
    }
}