import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { FavoriteTutorEntity } from "../entity/favoriteTutor.entity"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { LearnerEntity } from "../entity/profile/learner.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { FavoriteError } from "../core/exceptions/constants/favorite-error.enum"

/**
 * Repository for favorite api
 * @see FavoriteController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class FavoriteRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Like tutor by tutor id
     * @param tutor
     * @param learner
     */
    async likeTutor(tutor: TutorEntity, learner: LearnerEntity) {
        try {
            const favorite = new FavoriteTutorEntity()
            favorite.tutor = tutor
            favorite.learner = learner
            await this.connection.getRepository(FavoriteTutorEntity).save(favorite)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not like tutor by id", FavoriteError.CAN_NOT_LIKE_TUTOR)
        }
    }

    /**
     * Unlike tutor by tutor id
     * @param tutor
     * @param learner
     */
    async unLikeTutor(tutor: TutorEntity, learner: LearnerEntity) {
        try {
            const favorite = await this.connection.getRepository(FavoriteTutorEntity).findOne({
                where: {
                    tutor: tutor,
                    learner: learner
                }
            })

            await this.connection.getRepository(FavoriteTutorEntity).remove(favorite)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not unlike tutor by id", FavoriteError.CAN_NOT_UNLIKE_TUTOR)
        }
    }

    /**
     * Get favorite tutor list
     * @param learnerId
     */
    async getFavoriteTutorList(learnerId: string): Promise<FavoriteTutorEntity[]> {
        try {
            return await this.connection.createQueryBuilder(FavoriteTutorEntity, "favorite")
                .leftJoinAndSelect("favorite.tutor", "tutor")
                .leftJoinAndSelect("tutor.member", "member")
                .leftJoinAndSelect("tutor.statistic", "statistic")
                .leftJoinAndSelect("member.memberAddress", "address")
                .leftJoinAndSelect("member.interestedSubject", "interestedSubject")
                .leftJoinAndSelect("address.province", "province")
                .leftJoinAndSelect("address.district", "district")
                .leftJoinAndSelect("interestedSubject.subject", "subject")
                .where("favorite.learner like :learnerId", { learnerId: learnerId })
                .getMany()
        } catch (error) {
            logger.error(error)
        }
    }
}

export default FavoriteRepository