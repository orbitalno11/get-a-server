import { Injectable } from "@nestjs/common"
import { v4 as uuid } from "uuid"
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
import { CoinError } from "../../../core/exceptions/constants/coin.error"
import TutorProfile from "../../../model/profile/TutorProfile"
import { UserRole } from "../../../core/constant/UserRole"
import { AppGateway } from "../../../gateway/app.gateway"

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
        private readonly fileStorageUtil: FileStorageUtils,
        private readonly appGateway: AppGateway
    ) {
    }

    /**
     * Create clip data
     * @param data
     * @param file
     * @param user
     * @param socketId
     */
    async createClip(data: ClipForm, file: Express.Multer.File, user: User, socketId: string) {
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
                `online-course/${course.id}`,
                (loaded, total) => {
                    if (socketId?.isSafeNotBlank()) {
                        const progress = ((loaded / total) * 100) / 2
                        this.appGateway.sendUploadProgressToClient(progress, socketId)
                    }
                }
            )

            await this.repository.createClip(clipId, course.id, tutor, data, uploadedFile)

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
     * @param user
     */
    getClipById(clipId: string, user?: User): Promise<ClipDetail> {
        return launch(async () => {
            const clip = await this.repository.getClipById(clipId)

            if (isEmpty(clip)) {
                throw ErrorExceptions.create("Can not found clip", ClipError.CAN_NOT_FOUND_CLIP)
            }

            const clipDetail = new ClipEntityToClipDetailMapper().map(clip)

            if (user?.role === UserRole.LEARNER) {
                clipDetail.bought = await this.userUtil.isBoughtClip(user.id, clipId)
            }

            return clipDetail
        })
    }

    /**
     * Update clip detail
     * @param clipId
     * @param data
     * @param user
     * @param socketId
     * @param file
     */
    async updateClip(clipId: string, data: ClipForm, user: User, socketId: string, file?: Express.Multer.File) {
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
                    `online-course/${course.id}`,
                    (loaded, total) => {
                        if (socketId?.isSafeNotBlank()) {
                            const progress = ((loaded / total) * 100) / 2
                            this.appGateway.sendUploadProgressToClient(progress, socketId)
                        }
                    }
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

    /**
     * Buy clip
     * @param clipId
     * @param user
     */
    buyClip(clipId: string, user: User) {
        return launch(async () => {
            const bought = await this.userUtil.isBoughtClip(user.id, clipId)

            if (bought) {
                throw ErrorExceptions.create("Your already buy this clip", ClipError.ALREADY_BUY)
            }

            const clip = await this.repository.getClipById(clipId)
            const buyerBalance = await this.userUtil.getCoinBalance(user.id)

            if (clip.cost > buyerBalance.amount) {
                throw ErrorExceptions.create("Your coin is not enough", CoinError.NOT_ENOUGH)
            }

            const buyerTransactionId = "GET-A" + uuid()
            const tutorTransactionId = "GET-A" + uuid()

            const tutorBalance = await this.userUtil.getCoinBalance(clip.owner?.member?.id)

            await this.repository.buyClip(
                buyerTransactionId,
                tutorTransactionId,
                user.id,
                clip,
                buyerBalance,
                tutorBalance
            )
        })
    }

    /**
     * Delete clip
     * @param clipId
     * @param user
     */
    async deleteClip(clipId: string, user: User) {
        try {
            const clip = await this.repository.getClipOwner(clipId, TutorProfile.getTutorId(user.id))

            if (isEmpty(clip)) {
                throw ErrorExceptions.create("Can not found clip data", ClipError.CAN_NOT_FOUND_CLIP)
            }

            const subscribers = await this.repository.getClipSubscriberList(clipId)

            if (isNotEmpty(subscribers)) {
                throw ErrorExceptions.create("Can not delete clip data", ClipError.CAN_NOT_DELETE_CLIP_HAVE_SUBSCRIBER)
            }

            await this.repository.deleteClip(clipId, clip.onlineCourse.id)

            await this.fileStorageUtil.deleteFileFromPath(clip.urlCloudPath)
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}