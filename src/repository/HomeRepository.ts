import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { HomeError } from "../core/exceptions/constants/home-error.enum"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"

/**
 * Repository for home
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class HomeRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get tutor list by rank
     * @param rankLimit
     */
    async getTutorByRank(rankLimit: number = 10): Promise<TutorStatisticEntity[]> {
        try {
            return await this.connection.createQueryBuilder(TutorStatisticEntity, "statistic")
                .leftJoinAndSelect("statistic.tutor", "tutor")
                .leftJoinAndSelect("tutor.member", "member")
                .leftJoinAndSelect("member.memberAddress", "address")
                .leftJoinAndSelect("member.interestedSubject", "interestedSubject")
                .leftJoinAndSelect("address.province", "province")
                .leftJoinAndSelect("address.district", "district")
                .leftJoinAndSelect("interestedSubject.subject", "subject")
                .where("interestedSubject.subjectRank = 1")
                .orderBy("statistic.offlineCourseRank", "DESC")
                .addOrderBy("statistic.rating", "DESC")
                .limit(rankLimit)
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor rank", HomeError.CAN_NOT_GET_TUTOR_RANK)
        }
    }

    /**
     * Get online course by rank
     * @param rankLimit
     */
    async getOnlineCourse(rankLimit: number = 10): Promise<OnlineCourseEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OnlineCourseEntity, "course")
                .leftJoinAndSelect("course.statistic", "statistic")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("owner.member", "member")
                .orderBy("statistic.courseRank", "DESC")
                .addOrderBy("statistic.rating", "DESC")
                .limit(rankLimit)
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get online clip rank", HomeError.CAN_NOT_GET_ONLINE_COURSE_RANK)
        }
    }
}

export default HomeRepository