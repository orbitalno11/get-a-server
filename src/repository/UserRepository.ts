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
    async getOwnCourseById(tutorId: string, courseId: string, isOfflineCourse: boolean): Promise<OfflineCourseEntity | null> {
        try {
            if (isOfflineCourse) {
                return await this.connection.createQueryBuilder(OfflineCourseEntity, "offlineCourse")
                    .where("offlineCourse.id like :courseId", { courseId: courseId })
                    .andWhere("offlineCourse.owner like :tutorId", { tutorId: tutorId })
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
     * Get enrolled course data from learner id and course id\
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
}

export default UserRepository