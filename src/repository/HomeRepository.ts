import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { HomeError } from "../core/exceptions/constants/home-error.enum"

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
     * waiting for ranking sys. => change "offlineRating" to "offlineCourseRank"
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
                .orderBy("statistic.offlineRating", "DESC")
                .limit(rankLimit)
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor rank", HomeError.CAN_NOT_GET_TUTOR_RANK)
        }
    }
}

export default HomeRepository