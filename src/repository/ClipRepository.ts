import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import ClipForm from "../model/clip/ClipForm"
import { logger } from "../core/logging/Logger"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
import { ClipRatingEntity } from "../entity/course/clip/ClipRating.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { ClipError } from "../core/exceptions/constants/clip-error.enum"
import { TutorEntity } from "../entity/profile/tutor.entity"
import UploadedFileProperty from "../model/common/UploadedFileProperty"

/**
 * Repository class for clip
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class ClipRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Create clip data
     * @param clipId
     * @param course
     * @param tutor
     * @param data
     * @param clipUrl
     */
    async createClip(clipId: string, course: OnlineCourseEntity, tutor: TutorEntity, data: ClipForm, clipUrl: UploadedFileProperty) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const clip = new ClipEntity()
            clip.id = clipId
            clip.owner = tutor
            clip.onlineCourse = course
            clip.name = data.name
            clip.description = data.description
            clip.cost = data.cost
            clip.url = clipUrl.url
            clip.urlCloudPath = clipUrl.path

            const rating = new ClipRatingEntity()
            rating.clip = clip
            rating.reviewNumber = 0
            rating.rating = 0

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(clip)
            await queryRunner.manager.save(rating)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create clip", ClipError.CAN_NOT_CREATE_CLIP)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get clip detail by clip id
     * @param clipId
     */
    async getClipById(clipId: string): Promise<ClipEntity> {
        try {
            return this.connection.getRepository(ClipEntity)
                .findOne({
                    where: {
                        id: clipId
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get clip", ClipError.CAN_NOT_GET_CLIP)
        }
    }
}

export default ClipRepository