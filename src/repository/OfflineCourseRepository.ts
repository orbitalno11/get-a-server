import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import OfflineCourseForm from "../model/course/OfflineCourseForm"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { CourseStatus } from "../model/course/data/CourseStatus"
import { GradeEntity } from "../entity/common/grade.entity"
import { SubjectEntity } from "../entity/common/subject.entity"
import { CourseTypeEntity } from "../entity/course/courseType.entity"
import { OfflineCourseRatingEntity } from "../entity/course/offline/offlineCourseRating.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { CourseError } from "../core/exceptions/constants/course-error.enum"
import { OfflineCourseLeanerRequestEntity } from "../entity/course/offline/offlineCourseLearnerRequest.entity"
import { EnrollStatus } from "../model/course/data/EnrollStatus"

/**
 * Repository for offline course
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class OfflineCourseRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Create offline course
     * @param courseId
     * @param data
     * @param tutor
     */
    async createCourse(courseId: string, data: OfflineCourseForm, tutor: TutorEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const offlineCourse = new OfflineCourseEntity()
            offlineCourse.id = courseId
            offlineCourse.name = data.name
            offlineCourse.description = data.description
            offlineCourse.cost = data.cost
            offlineCourse.day = data.dayOfWeek
            offlineCourse.startTime = data.startTime
            offlineCourse.endTime = data.endTime
            offlineCourse.status = CourseStatus.OPEN
            offlineCourse.requestNumber = 0
            offlineCourse.grade = GradeEntity.createFromGrade(data.grade)
            offlineCourse.subject = SubjectEntity.createFromCode(data.subject)
            offlineCourse.courseType = CourseTypeEntity.createFromType(data.type)
            offlineCourse.owner = tutor

            const courseRating = new OfflineCourseRatingEntity()
            courseRating.course = offlineCourse
            courseRating.reviewNumber = 0
            courseRating.rating = 0

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(offlineCourse)
            await queryRunner.manager.save(courseRating)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create offline course", CourseError.CAN_NOT_CREATE_COURSE)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get offline course detail
     * @param courseId
     */
    async getOfflineCourse(courseId: string): Promise<OfflineCourseEntity> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                .leftJoinAndSelect("course.courseType", "type")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("course.rating", "rating")
                .leftJoinAndSelect("owner.member", "member")
                .leftJoinAndSelect("owner.contact", "contact")
                .where("course.id like :id")
                .setParameter("id", courseId)
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get offline course", CourseError.CAN_NOT_GET_OFFLINE_COURSE)
        }
    }

    /**
     * Get enroll learner list
     * @param courseId
     */
    async getEnrollList(courseId: string): Promise<OfflineCourseLeanerRequestEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseLeanerRequestEntity, "courseRequest")
                .leftJoinAndSelect("courseRequest.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .leftJoinAndSelect("member.memberAddress", "address")
                .leftJoinAndSelect("address.province", "province")
                .leftJoinAndSelect("address.district", "district")
                .where("courseRequest.course.id like :id", { id: courseId })
                .andWhere("courseRequest.status in (:status)", { status: [EnrollStatus.WAITING_FOR_APPROVE, EnrollStatus.APPROVE] })
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get enroll list", CourseError.CAN_NOT_GET_ENROLL_LIST)
        }
    }
}

export default OfflineCourseRepository