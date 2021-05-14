import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { OfflineCourseLeanerRequestEntity } from "../entity/course/offline/offlineCourseLearnerRequest.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { LearnerError } from "../core/exceptions/constants/learner-error.enum"

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
            throw ErrorExceptions.create("Can not get offline course", LearnerError.CAN_NOT_GET_OFFLINE_COURSE_LIST)
        }
    }
}

export default LearnerRepository