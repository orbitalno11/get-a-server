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
import { FileExtension } from "../../../core/constant/FileType"

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

    async createClip(data: ClipForm, file: Express.Multer.File, user: User) {
        let clipUrl = ""
        try {
            const tutor = await this.userUtil.getTutor(user.id)
            const course = await this.userUtil.getCourseOwn(user.id, data.courseId, false)

            if (isEmpty(course)) {
                logger.error("Do not have permission")
                throw ErrorExceptions.create("Do not have permission", UserError.DO_NOT_HAVE_PERMISSION)
            }

            clipUrl = await this.fileStorageUtil.uploadFileTo(file, user.id, `online-${course.id}`, FileExtension.MP4)



        } catch (error) {
            logger.error(error)
        }
    }
}