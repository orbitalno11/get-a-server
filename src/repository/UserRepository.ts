import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { MemberEntity } from "../entity/member/member.entitiy"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserError from "../core/exceptions/constants/user-error.enum"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { EnrollStatus } from "../model/course/data/EnrollStatus"
import { OfflineCourseRatingTransactionEntity } from "../entity/course/offline/offlineCourseRatingTransaction.entity"
import { FavoriteTutorEntity } from "../entity/favoriteTutor.entity"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { CoinEntity } from "../entity/coins/coin.entity"
import { CoinError } from "../core/exceptions/constants/coin.error"
import { isEmpty } from "../core/extension/CommonExtension"
import { ClipTransactionEntity } from "../entity/course/clip/ClipTransaction.entity"
import { ClipError } from "../core/exceptions/constants/clip-error.enum"

/**
 * Repository for user utility
 * @see UserUtil
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class UserRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get user with role
     * @param userId
     */
    async getUserWithRole(userId: string): Promise<MemberEntity | null> {
        try {
            return await this.connection.createQueryBuilder(MemberEntity, "member")
                .leftJoinAndSelect("member.memberRole", "memberRole")
                .leftJoinAndSelect("memberRole.role", "role")
                .where("member.id like :id", { id: userId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user", UserError.CAN_NOT_FIND)
        }
    }

    /**
     * Get tutor entity from tutor id
     * @param tutorID
     */
    async getTutor(tutorID: string): Promise<TutorEntity | null> {
        try {
            return await this.connection.getRepository(TutorEntity).findOne(tutorID)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user", UserError.CAN_NOT_FIND)
        }
    }

    /**
     * Get learner entity from learner id
     * @param learnerId
     */
    async getLearner(learnerId: string): Promise<LearnerEntity | null> {
        try {
            return await this.connection.getRepository(LearnerEntity).findOne(learnerId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user", UserError.CAN_NOT_FIND)
        }
    }

    /**
     * Get course data from tutor id and course id
     * @param tutorId
     * @param courseId
     * @param isOfflineCourse
     */
    async getOwnCourseById(tutorId: string, courseId: string, isOfflineCourse: boolean): Promise<OfflineCourseEntity | OnlineCourseEntity | null> {
        try {
            if (isOfflineCourse) {
                return await this.connection.createQueryBuilder(OfflineCourseEntity, "offlineCourse")
                    .where("offlineCourse.id like :courseId", { courseId: courseId })
                    .andWhere("offlineCourse.owner like :tutorId", { tutorId: tutorId })
                    .getOne()
            } else {
                return await this.connection.createQueryBuilder(OnlineCourseEntity, "onlineCourse")
                    .where("onlineCourse.id like :courseId", { courseId: courseId })
                    .andWhere("onlineCourse.owner like :tutorId", { tutorId: tutorId })
                    .getOne()
                return null
            }
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get enrolled course data from learner id and course id
     * (offline course will get only course that request status is APPROVE)
     * @param learnerId
     * @param courseId
     * @param isOfflineCourse
     */
    async getEnrolledCourseById(learnerId: string, courseId: string, isOfflineCourse: boolean): Promise<OfflineCourseEntity | null> {
        try {
            if (isOfflineCourse) {
                return await this.connection.createQueryBuilder(OfflineCourseEntity, "offlineCourse")
                    .leftJoinAndSelect("offlineCourse.requestList", "requestList")
                    .leftJoinAndSelect("offlineCourse.owner", "owner")
                    .where("offlineCourse.id like :courseId", { courseId: courseId })
                    .andWhere("requestList.learner like :learnerId", { learnerId: learnerId })
                    .andWhere("requestList.status = :enrollStatus", { enrollStatus: EnrollStatus.APPROVE })
                    .getOne()
            } else {
                // todo query online course -> waiting for online course task
                return null
            }
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get course review by learner id and course id
     * @param learnerId
     * @param courseId
     * @param isOfflineCourse
     */
    async getReviewCourseById(learnerId: string, courseId: string, isOfflineCourse: boolean): Promise<OfflineCourseRatingTransactionEntity | null> {
        try {
            if (isOfflineCourse) {
                return await this.connection.createQueryBuilder(OfflineCourseRatingTransactionEntity, "review")
                    .where("review.learner like :learnerId", { learnerId: learnerId })
                    .andWhere("review.course like :courseId", { courseId: courseId })
                    .getOne()
            } else {
                // todo query online course -> waiting for online course task
                return null
            }
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get favorite tutor
     * @param learnerId
     * @param tutorId
     */
    async getFavoriteTutor(learnerId: string, tutorId: string): Promise<FavoriteTutorEntity | null> {
        try {
            return await this.connection.createQueryBuilder(FavoriteTutorEntity, "favorite")
                .where("favorite.learner like :learnerId", { learnerId: learnerId })
                .andWhere("favorite.tutor like :tutorId", { tutorId: tutorId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get coin balance
     * @param userId
     */
    async getCoinBalance(userId: string): Promise<CoinEntity> {
        try {
            let balance = await this.connection.getRepository(CoinEntity)
                .findOne({
                    where: {
                        member: userId
                    }
                })

            if (isEmpty(balance)) {
                const member = await this.getUserWithRole(userId)
                balance = new CoinEntity()
                balance.member = member
                balance.amount = 0
                balance.updated = new Date()
                await this.connection.getRepository(CoinEntity).save(balance)
            }
            
            return balance
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not found coin balance", CoinError.CAN_NOT_FOUND_COIN_BALANCE)
        }
    }

    /**
     * Get bought clip transaction entity by learner and clip id
     * @param learnerId
     * @param clipId
     */
    async getBoughtClip(learnerId: string, clipId: string): Promise<ClipTransactionEntity> {
        try {
            const clip =  await this.connection.getRepository(ClipTransactionEntity)
                .findOne({
                    where: {
                        learner: learnerId,
                        clip: clipId
                    }
                })
            return clip
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can get clip transaction", ClipError.CAN_NOT_FOUND_CLIP)
        }
    }
}

export default UserRepository