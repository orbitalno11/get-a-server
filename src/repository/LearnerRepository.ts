import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { OfflineCourseLeanerRequestEntity } from "../entity/course/offline/offlineCourseLearnerRequest.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { LearnerError } from "../core/exceptions/constants/learner-error.enum"
import { ClipTransactionEntity } from "../entity/course/clip/ClipTransaction.entity"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"

@Injectable()
class LearnerRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get learner offline course
     * @param learnerId
     */
    async getOfflineCourse(learnerId: string): Promise<OfflineCourseLeanerRequestEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseLeanerRequestEntity, "request")
                .leftJoinAndSelect("request.course", "course")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.owner", "tutor")
                .leftJoinAndSelect("tutor.member", "member")
                .where("request.learnerId like :learnerId", { learnerId: learnerId })
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get offline course", LearnerError.CAN_NOT_GET_COURSE_LIST)
        }
    }

    /**
     * Get learner online course
     * @param learnerId
     */
    async getOnlineCourse(learnerId: string): Promise<OnlineCourseEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OnlineCourseEntity, "course")
                .leftJoinAndSelect("course.clips", "clip")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("clip.clipTransaction", "transaction")
                .where("transaction.learner like :learnerId", { learnerId: learnerId})
                .distinct(true)
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get online course", LearnerError.CAN_NOT_GET_COURSE_LIST)
        }
    }
}

export default LearnerRepository