import { Injectable } from "@nestjs/common"
import ClipRepository from "../../../repository/ClipRepository"
import User from "../../../model/User"
import ClipForm from "../../../model/clip/ClipForm"
import { logger } from "../../../core/logging/Logger"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import UserUtil from "../../../utils/UserUtil"

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
        try {
            const tutor = await this.userUtil.getTutor(user.id)
            const courseOwner = await this.userUtil.isCourseOwner(user.id, data.courseId, false)
        } catch (error) {
            logger.error(error)
        }
    }
}