import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import OnlineCourseForm from "../model/course/OnlineCourseForm"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { logger } from "../core/logging/Logger"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { SubjectEntity } from "../entity/common/subject.entity"
import { GradeEntity } from "../entity/common/grade.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { CourseError } from "../core/exceptions/constants/course-error.enum"
import OnlineCourseNameList from "../model/course/OnlineCourseNameList"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
import { OnlineCourseStatisticEntity } from "../entity/course/online/OnlineCourseStatistic.entity"
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate"

/**
 * Repository for online course
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class OnlineCourseRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Create online course
     * @param courseId
     * @param data
     * @param tutor
     */
    async createOnlineCourse(courseId: string, data: OnlineCourseForm, tutor: TutorEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const statistic = new OnlineCourseStatisticEntity()
            statistic.rating = 0
            statistic.numberOfClip = 0
            statistic.numberOfClipView = 0
            statistic.numberOfReview = 0

            const onlineCourse = this.getOnlineCourseEntity(courseId, data, tutor)
            onlineCourse.statistic = statistic
            onlineCourse.created = new Date()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(onlineCourse)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create online course", CourseError.CAN_NOT_CREATE_COURSE)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get Online course by id
     * @param courseId
     */
    async getOnlineCourseById(courseId: string): Promise<OnlineCourseEntity> {
        try {
            return await this.connection.createQueryBuilder(OnlineCourseEntity, "course")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("course.owner", "tutor")
                .leftJoinAndSelect("course.statistic", "statistic")
                .leftJoinAndSelect("course.clips", "clips")
                .leftJoinAndSelect("tutor.member", "member")
                .leftJoinAndSelect("tutor.contact", "contact")
                .where("course.id like :courseId", { courseId: courseId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get online course", CourseError.CAN_NOT_GET_COURSE)
        }
    }

    /**
     * Tutor get own course name list
     * @param tutorId
     */
    async getOnlineCourseNameList(tutorId: string): Promise<OnlineCourseNameList[]> {
        try {
            return await this.connection.getRepository(OnlineCourseEntity).find({
                select: ["id", "name"],
                where: {
                    owner: tutorId
                }
            })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get course name list", CourseError.CAN_NOT_GET_COURSE)
        }
    }

    /**
     * Update online course
     * @param courseId
     * @param data
     * @param tutor
     */
    async updateOnlineCourse(courseId: string, data: OnlineCourseForm, tutor: TutorEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const onlineCourse = this.getOnlineCourseEntity(courseId, data, tutor)

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(onlineCourse)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create online course", CourseError.CAN_NOT_CREATE_COURSE)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get clip list in course by course id
     * @param courseId
     */
    async getClipInOnlineCourse(courseId: string): Promise<ClipEntity[]> {
        try {
            return this.connection.getRepository(ClipEntity)
                .find({
                    where: {
                        onlineCourse: courseId
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get clip in course", CourseError.CAN_NOT_GET_CLIP_IN_COURSE)
        }
    }

    /**
     * Get bought clip list
     * @param courseId
     * @param learnerId
     */
    async getBoughtClipInOnlineCourse(courseId: string, learnerId: string): Promise<ClipEntity[]> {
        try {
            return this.connection.createQueryBuilder(ClipEntity, "clip")
                .leftJoinAndSelect("clip.transaction", "transaction")
                .where("clip.onlineCourse like :courseId", { courseId: courseId })
                .andWhere("transaction.learner like :learnerId", { learnerId: learnerId })
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get clip in course", CourseError.CAN_NOT_GET_CLIP_IN_COURSE)
        }
    }

    /**
     * Get new online course
     * @param pageOption
     */
    async getNewOnlineCourse(pageOption: IPaginationOptions): Promise<Pagination<OnlineCourseEntity>> {
        try {
            const query = this.connection.createQueryBuilder(OnlineCourseEntity, "course")
                .leftJoinAndSelect("course.statistic", "statistic")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("owner.member", "member")
                .orderBy("course.created", "DESC")
                .orderBy("statistic.courseRank", "DESC")
                .orderBy("statistic.rating", "DESC")

            return paginate<OnlineCourseEntity>(query, pageOption)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get course", CourseError.CAN_NOT_GET_COURSE)
        }
    }

    /**
     * Create online course entity
     * @param courseId
     * @param data
     * @param tutor
     * @private
     */
    private getOnlineCourseEntity(courseId: string, data: OnlineCourseForm, tutor: TutorEntity): OnlineCourseEntity {
        const onlineCourse = new OnlineCourseEntity()
        onlineCourse.id = courseId
        onlineCourse.name = data.name
        onlineCourse.subject = SubjectEntity.createFromCode(data.subject)
        onlineCourse.grade = GradeEntity.createFromGrade(data.grade)
        onlineCourse.coverUrl = data.coverUrl
        onlineCourse.owner = tutor
        onlineCourse.updated = new Date()
        return onlineCourse
    }
}

export default OnlineCourseRepository