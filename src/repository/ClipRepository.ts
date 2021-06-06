import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import ClipForm from "../model/clip/ClipForm"
import { logger } from "../core/logging/Logger"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
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
import { ClipStatisticEntity } from "../entity/course/clip/ClipStatistic.entity"
import { OnlineCourseStatisticEntity } from "../entity/course/online/OnlineCourseStatistic.entity"

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
     * @param courseId
     * @param tutor
     * @param data
     * @param clipUrl
     */
    async createClip(clipId: string, courseId: string, tutor: TutorEntity, data: ClipForm, clipUrl: UploadedFileProperty) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const statistic = new ClipStatisticEntity()
            statistic.rating = 0
            statistic.clipRank = 0
            statistic.numberOfView = 0
            statistic.numberOfReview = 0
            statistic.oneStar = 0
            statistic.twoStar = 0
            statistic.threeStar = 0
            statistic.fourStar = 0
            statistic.fiveStar = 0

            const course = new OnlineCourseEntity()
            course.id = courseId

            const clip = new ClipEntity()
            clip.id = clipId
            clip.owner = tutor
            clip.onlineCourse = course
            clip.name = data.name
            clip.description = data.description
            clip.cost = data.cost
            clip.url = clipUrl.url
            clip.urlCloudPath = clipUrl.path
            clip.statistic = statistic

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(clip)
            await queryRunner.manager.update(OnlineCourseStatisticEntity,
                { onlineCourse: courseId },
                {
                    numberOfClip: () => "number_of_clip + 1"
                })
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
     * @param clipId
     * @param courseId
     */
    async deleteClip(clipId: string, courseId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.delete(ClipStatisticEntity, { clip: clipId })
            await queryRunner.manager.delete(ClipEntity, clipId)
            await queryRunner.manager.update(OnlineCourseStatisticEntity,
                { onlineCourse: courseId },
                {
                    numberOfClip: () => "number_of_clip - 1"
                })

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