import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import User from "../model/User"
import {logger} from "../core/logging/Logger"
import {UserRoleKey} from "../core/constant/UserRole"
import {TutorEntity} from "../entity/profile/tutor.entity"
import TutorProfile from "../model/profile/TutorProfile"
import {LearnerEntity} from "../entity/profile/learner.entity"
import LearnerProfile from "../model/profile/LearnerProfile"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserErrorType from "../core/exceptions/model/UserErrorType"

/**
 * Repository class for "v1/me" route
 * @author oritalno11 2021 A.D.
 */
@Injectable()
class MeRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get user profile from simple user data (user id, user role)
     * @param user
     */
    async getUserProfile(user: User): Promise<TutorEntity | LearnerEntity | null> {
        try {
            switch (user.role) {
                case UserRoleKey.TUTOR: {
                    return await this.connection.createQueryBuilder(TutorEntity, "tutor")
                        .leftJoinAndSelect("tutor.member", "member")
                        .leftJoinAndSelect("tutor.contact", "contact")
                        .leftJoinAndSelect("member.memberAddress", "memberAddress")
                        .where("tutor.id like :id")
                        .setParameter("id", TutorProfile.getTutorId(user.id))
                        .getOne()
                }
                case UserRoleKey.LEARNER: {
                    return await this.connection
                        .createQueryBuilder(LearnerEntity, "learner")
                        .leftJoinAndSelect("learner.member", "member")
                        .leftJoinAndSelect("learner.contact", "contact")
                        .where("learner.id like :id")
                        .setParameter("id", LearnerProfile.getLearnerId(user.id))
                        .getOne()
                }
                default: {
                    return null
                }
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user profile", UserErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default MeRepository