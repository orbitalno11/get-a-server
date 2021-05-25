import { Injectable } from "@nestjs/common"
import ClipRepository from "../../../repository/ClipRepository"
import User from "../../../model/User"
import ClipForm from "../../../model/clip/ClipForm"
import { logger } from "../../../core/logging/Logger"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import UserUtil from "../../../utils/UserUtil"
import { isEmpty, isNotEmpty } from "../../../core/extension/CommonExtension"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { OnlineCourseEntity } from "../../../entity/course/online/OnlineCourse.entity"
import { OfflineCourseEntity } from "../../../entity/course/offline/offlineCourse.entity"
import UploadedFileProperty from "../../../model/common/UploadedFileProperty"
import { ClipError } from "../../../core/exceptions/constants/clip-error.enum"
import { launch } from "../../../core/common/launch"
import { ClipEntityToClipDetailMapper } from "../../../utils/mapper/clip/ClipEntityToClipDetail.mapper"
import ClipDetail from "../../../model/clip/ClipDetail"

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
            throw error
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

    /**
     * Get clip detail by clip id
     * @param clipId
     */
    getClipById(clipId: string): Promise<ClipDetail> {
        return launch(async () => {
            const clip = await this.repository.getClipById(clipId)
            return isNotEmpty(clip) ? new ClipEntityToClipDetailMapper().map(clip) : null
        })
    }

    /**
     * Update clip detail
     * @param clipId
     * @param data
     * @param user
     * @param file
     */
    async updateClip(clipId: string, data: ClipForm, user: User, file?: Express.Multer.File) {
        let uploadedFile: UploadedFileProperty
        let oldUploadedFile: UploadedFileProperty
        try {
            const clip = await this.repository.getClipById(clipId)

            if (isEmpty(clip)) {
                logger.error("Can not found clip data")
                throw ErrorExceptions.create("Can not found clip data", ClipError.CAN_NOT_FOUND_CLIP)
            }

            const course = await this.userUtil.getCourseOwn(user.id, data.courseId, false)

            if (isEmpty(course) || course instanceof OfflineCourseEntity) {
                logger.error("Do not have permission")
                throw ErrorExceptions.create("Do not have permission", UserError.DO_NOT_HAVE_PERMISSION)
            }

            if (isNotEmpty(file)) {
                uploadedFile = await this.fileStorageUtil.uploadVideoFromLocalStorageTo(
                    file,
                    user.id,
                    `online-course/${course.id}`
                )
                oldUploadedFile = {
                    path: clip.urlCloudPath,
                    url: clip.url
                }
            } else {
                uploadedFile = {
                    path: clip.urlCloudPath,
                    url: clip.url
                }
            }

            await this.repository.updateClipDetail(clipId, course, data, uploadedFile)

            if (oldUploadedFile?.path?.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFileFromPath(oldUploadedFile?.path)
            }

            return clipId
        } catch (error) {
            logger.error(error)
            if (uploadedFile?.path?.isSafeNotBlank() && oldUploadedFile?.path?.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFileFromPath(uploadedFile?.path)
            }
            throw error
        }
    }
}