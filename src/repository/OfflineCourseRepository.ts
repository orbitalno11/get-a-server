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
}

export default OfflineCourseRepository