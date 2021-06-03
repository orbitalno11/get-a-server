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
import { CoinTransactionEntity } from "../entity/coins/CoinTransaction.entity"
import { ClipTransactionEntity } from "../entity/course/clip/ClipTransaction.entity"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { MemberEntity } from "../entity/member/member.entitiy"
import { CoinEntity } from "../entity/coins/coin.entity"
import LearnerProfile from "../model/profile/LearnerProfile"
import { CoinTransactionType } from "../model/coin/data/CoinTransaction.enum"

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
            // course.numberOfClip += 1

            const clip = new ClipEntity()
            clip.id = clipId
            clip.owner = tutor
            clip.onlineCourse = course
            clip.name = data.name
            clip.description = data.description
            clip.cost = data.cost
            clip.url = clipUrl.url
            clip.urlCloudPath = clipUrl.path
            clip.clipView = 0

            const rating = new ClipRatingEntity()
            rating.clip = clip
            rating.reviewNumber = 0
            rating.rating = 0

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(course)
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
            return this.connection.createQueryBuilder(ClipEntity, "clip")
                .leftJoinAndSelect("clip.owner", "owner")
                .leftJoinAndSelect("owner.member", "member")
                .leftJoinAndSelect("clip.onlineCourse", "course")
                .where("clip.id like :clipId", { clipId: clipId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get clip", ClipError.CAN_NOT_GET_CLIP)
        }
    }

    /**
     * Update clip detail
     * @param clipId
     * @param course
     * @param data
     * @param clipUrl
     */
    async updateClipDetail(clipId: string, course: OnlineCourseEntity, data: ClipForm, clipUrl: UploadedFileProperty) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const clip = new ClipEntity()
            clip.id = clipId
            clip.name = data.name
            clip.description = data.description
            clip.cost = data.cost
            clip.url = clipUrl.url
            clip.urlCloudPath = clipUrl.path

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(clip)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update clip detail", ClipError.CAN_NOT_UPDATE_CLIP)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Buy clip
     * @param buyerTransactionId
     * @param tutorTransactionId
     * @param buyerUserId
     * @param clip
     * @param buyerBalance
     * @param tutorBalance
     */
    async buyClip(
        buyerTransactionId: string,
        tutorTransactionId: string,
        buyerUserId: string,
        clip: ClipEntity,
        buyerBalance: CoinEntity,
        tutorBalance: CoinEntity
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const buyerMember = new MemberEntity()
            buyerMember.id = buyerUserId

            const learner = new LearnerEntity()
            learner.id = LearnerProfile.getLearnerId(buyerUserId)

            const tutorMember = new MemberEntity()
            tutorMember.id = clip.owner?.member?.id

            const buyerTransaction = new CoinTransactionEntity()
            buyerTransaction.transactionId = buyerTransactionId
            buyerTransaction.member = buyerMember
            buyerTransaction.transactionType = CoinTransactionType.PAID
            buyerTransaction.numberOfCoin = clip.cost
            buyerTransaction.transactionDate = new Date()

            const tutorTransaction = new CoinTransactionEntity()
            tutorTransaction.transactionId = tutorTransactionId
            tutorTransaction.member = tutorMember
            tutorTransaction.transactionType = CoinTransactionType.INCOME
            tutorTransaction.numberOfCoin = clip.cost
            tutorTransaction.transactionDate = new Date()

            const clipTransaction = new ClipTransactionEntity()
            clipTransaction.clip = clip
            clipTransaction.learner = learner
            clipTransaction.transaction = buyerTransaction

            buyerBalance.amount -= clip.cost
            buyerBalance.updated = new Date()

            tutorBalance.amount += clip.cost
            tutorBalance.updated = new Date()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(buyerTransaction)
            await queryRunner.manager.save(tutorTransaction)
            await queryRunner.manager.save(clipTransaction)
            await queryRunner.manager.save(buyerBalance)
            await queryRunner.manager.save(tutorBalance)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not by clip", ClipError.CAN_NOT_BUY_CLIP)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get clip detail with owner id
     * @param clipId
     * @param tutorId
     */
    async getClipOwner(clipId: string, tutorId: string): Promise<ClipEntity> {
        try {
            return await this.connection.getRepository(ClipEntity)
                .findOne({
                    where: {
                        id: clipId,
                        owner: tutorId
                    },
                    join: {
                        alias: "clip",
                        leftJoinAndSelect: {
                            onlineCourse: "clip.onlineCourse"
                        }
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not found clip", ClipError.CAN_NOT_FOUND_CLIP)
        }
    }

    /**
     * Get clip subscribers
     * @param clipId
     */
    async getClipSubscriberList(clipId: string): Promise<ClipTransactionEntity[]> {
        try {
            return await this.connection.createQueryBuilder(ClipTransactionEntity, "transaction")
                .leftJoinAndSelect("transaction.clip", "clip")
                .leftJoinAndSelect("transaction.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("transaction.clip.id like :clipId", { clipId: clipId })
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not found clip", ClipError.CAN_NOT_GET_SUBSCRIBE_LIST)
        }
    }

    /**
     * Delete clip
     * @param clip
     */
    async deleteClip(clip: ClipEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const clipRating = await queryRunner.manager.getRepository(ClipRatingEntity).findOne(
                {
                    where: {
                        clip: clip
                    }
                }
            )

            const course = await queryRunner.manager.getRepository(OnlineCourseEntity).findOne({
                where: {
                    id: clip.onlineCourse.id
                }
            })

            // course.numberOfClip -= 1

            await queryRunner.manager.save(course)
            await queryRunner.manager.remove(clipRating)
            await queryRunner.manager.remove(clip)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not delete clip", ClipError.CAN_NOT_DELETE_CLIP)
        } finally {
            await queryRunner.release()
        }
    }
}

export default ClipRepository