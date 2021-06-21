import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { AnalyticError } from "../core/exceptions/constants/analytic-error.enum"
import { TutorAnalyticRecencyEntity } from "../entity/analytic/TutorAnalyticRecency.entity"
import { TutorAnalyticFrequencyEntity } from "../entity/analytic/TutorAnalyticFrequency.entity"
import { CourseType } from "../model/course/data/CourseType"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { isNotEmpty } from "../core/extension/CommonExtension"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
import { OfflineCourseStatisticEntity } from "../entity/course/offline/OfflineCourseStatistic.entity"
import { ClipStatisticEntity } from "../entity/course/clip/ClipStatistic.entity"
import { OnlineCourseStatisticEntity } from "../entity/course/online/OnlineCourseStatistic.entity"

/**
 * Repository for analytic manager
 * @see AnalyticManager
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class AnalyticRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Increase number of favorite
     * @param tutorId
     */
    async increaseNumberOfFavorite(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: () => "number_of_favorite + 1"
                })
            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: () => "number_of_favorite + 1"
                })
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    async decreaseNumberOfFavorite(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: () => "number_of_favorite - 1"
                })
            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    numberOfFavorite: () => "number_of_favorite - 1"
                })
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor login
     * @param tutorId
     */
    async trackLogin(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const frequency = await this.getTutorFrequency(tutorId)

            await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                { tutor: tutorId },
                {
                    recentLogin: new Date()
                })
            await queryRunner.manager.update(TutorAnalyticFrequencyEntity,
                { tutor: tutorId },
                {
                    numberOfLogin: frequency.numberOfLogin + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor profile view
     * @param tutorId
     */
    async trackProfileView(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const frequency = await this.getTutorFrequency(tutorId)

            await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                { tutor: tutorId },
                {
                    recentProfileView: new Date()
                })
            await queryRunner.manager.update(TutorAnalyticFrequencyEntity,
                { tutor: tutorId },
                {
                    numberOfProfileView: frequency.numberOfProfileView + 1
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor course view
     * @param courseId
     * @param courseType
     */
    async trackImpressCourse(courseId: string, courseType: CourseType) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            let tutorId = ""

            if (courseType === CourseType.OFFLINE_SINGLE || courseType === CourseType.OFFLINE_GROUP) {
                const { ownerId } = await queryRunner.manager.createQueryBuilder(OfflineCourseEntity, "course")
                    .select("course.ownerId")
                    .where("course.id like :courseId", { courseId: courseId })
                    .getRawOne()

                if (ownerId?.isSafeNotBlank()) {
                    tutorId = ownerId
                    await queryRunner.manager.update(OfflineCourseStatisticEntity,
                        { course: courseId },
                        {
                            numberOfView: () => "number_of_view + 1"
                        })
                }

            } else if (courseType === CourseType.ONLINE) {
                const onlineCourse = await queryRunner.manager.getRepository(OnlineCourseEntity)
                    .findOne({
                        where: {
                            id: courseId
                        },
                        join: {
                            alias: "onlineCourse",
                            leftJoinAndSelect: {
                                owner: "onlineCourse.owner"
                            }
                        }
                    })

                if (isNotEmpty(onlineCourse)) {
                    tutorId = onlineCourse.owner.id
                    await queryRunner.manager.update(OnlineCourseStatisticEntity,
                        {onlineCourse: courseId },
                        {
                            numberOfClipView: () => "number_of_clip_view + 1"
                        })
                }
            }

            if (tutorId.isSafeNotBlank()) {
                await queryRunner.manager.update(TutorAnalyticFrequencyEntity,
                    { tutor: tutorId },
                    {
                        numberOfCourseView: () => "number_of_course_view + 1"
                    })
            }

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor approve learner to course
     * @param tutorId
     */
    async trackTutorApproved(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(TutorAnalyticMonetaryEntity,
                { tutor: tutorId },
                {
                    numberOfLearner: () => "number_of_learner + 1"
                })
            await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                { tutor: tutorId },
                {
                    recentApproved: new Date()
                })
            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    numberOfLearner: () => "number_of_learner + 1"
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor create offline course
     * @param tutorId
     */
    async trackTutorCreateOfflineCourse(tutorId: string) {
        try {
            await this.connection.createQueryBuilder()
                .update(TutorStatisticEntity)
                .set({
                    offlineCourseNumber: () => "number_of_offline_course + 1"
                })
                .where("tutor like :tutorId", { tutorId: tutorId })
                .execute()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        }
    }

    /**
     * Track learner review
     * @param tutorId
     * @param statistic
     * @param monetary
     * @param deleteReview
     */
    async trackLearnerReview(
        tutorId: string,
        statistic: TutorStatisticEntity,
        monetary: TutorAnalyticMonetaryEntity,
        deleteReview: boolean
    ) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.save(statistic)
            await queryRunner.manager.save(monetary)
            if (!deleteReview) {
                await queryRunner.manager.update(TutorAnalyticRecencyEntity,
                    { tutor: tutorId },
                    {
                        recentComment: new Date()
                    })
            }
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track tutor create online course
     * @param tutorId
     */
    async trackCreateOnlineCourse(tutorId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.update(TutorStatisticEntity,
                { tutor: tutorId },
                {
                    onlineCourseNumber: () => "number_of_online_course + 1"
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Track impress clip view
     * @param clipId
     */
    async trackImpressClip(clipId: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const { onlineCourseId } = await this.connection.createQueryBuilder(ClipEntity, "clip")
                .select("clip.onlineCourse")
                .where("clip.id like :clipId", { clipId: clipId })
                .getRawOne()

            await queryRunner.manager.update(ClipStatisticEntity,
                { clip: clipId },
                {
                    numberOfView: () => "number_of_view + 1"
                })

            await queryRunner.manager.update(OnlineCourseStatisticEntity,
                { onlineCourse: onlineCourseId },
                {
                    numberOfClipView: () => "number_of_clip_view + 1"
                })

            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get tutor statistic entity
     * @param tutorId
     * @private
     */
    async getTutorStatistic(tutorId: string): Promise<TutorStatisticEntity> {
        try {
            return await this.connection.getRepository(TutorStatisticEntity).createQueryBuilder("statistic")
                .innerJoinAndSelect("statistic.tutor", "tutor")
                .where("statistic.tutor like :tutorId", { tutorId: tutorId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor recency analytic", AnalyticError.CAN_NOT_GET_TUTOR_RECENCY)
        }
    }

    /**
     * Get tutor frequency entity
     * @param tutorId
     * @private
     */
    async getTutorFrequency(tutorId: string): Promise<TutorAnalyticFrequencyEntity> {
        try {
            return await this.connection.getRepository(TutorAnalyticFrequencyEntity).createQueryBuilder("frequency")
                .innerJoinAndSelect("frequency.tutor", "tutor")
                .where("frequency.tutor like :tutorId", { tutorId: tutorId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor frequency analytic", AnalyticError.CAN_NOT_GET_TUTOR_FREQ)
        }
    }

    /**
     * Get tutor monetary entity
     * @param tutorId
     * @private
     */
    async getTutorMonetary(tutorId: string): Promise<TutorAnalyticMonetaryEntity> {
        try {
            return await this.connection.getRepository(TutorAnalyticMonetaryEntity).createQueryBuilder("monetary")
                .innerJoinAndSelect("monetary.tutor", "tutor")
                .where("monetary.tutor like :tutorId", { tutorId: tutorId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get tutor monetary analytic", AnalyticError.CAN_NOT_GET_TUTOR_MONETARY)
        }
    }

    /**
     * Clear analytic data
     */
    async clearAnalyticData() {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.createQueryBuilder()
                .update(TutorAnalyticRecencyEntity)
                .set({
                    recentLogin: null,
                    recentProfileView: null,
                    recentComment: null,
                    recentApproved: null
                })
                .execute()
            await queryRunner.manager.createQueryBuilder()
                .update(TutorAnalyticFrequencyEntity)
                .set({
                    numberOfLogin: 0,
                    numberOfProfileView: 0,
                    numberOfCourseView: 0
                })
                .execute()
            await queryRunner.manager.createQueryBuilder()
                .update(TutorAnalyticMonetaryEntity)
                .set({
                    rating: 0,
                    offlineRating: 0,
                    onlineRating: 0,
                    numberOfFavorite: 0,
                    numberOfLearner: 0,
                    numberOfOfflineReview: 0,
                    numberOfOnlineReview: 0
                })
                .execute()
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not update analytic data", AnalyticError.CAN_NOT_UPDATE_ANALYTIC_DATA)
        } finally {
            await queryRunner.release()
        }
    }
}

export default AnalyticRepository