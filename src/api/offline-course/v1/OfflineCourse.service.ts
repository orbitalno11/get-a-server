import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import {v4 as uuidV4} from "uuid"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import {logger} from "../../../core/logging/Logger"
import {CourseType} from "../../../model/course/data/CourseType"
import {Subject} from "../../../model/common/data/Subject"
import {Grade} from "../../../model/common/data/Grade"
import {OfflineCourseEntity} from "../../../entity/course/offline/offlineCourse.entity"
import {CourseStatus} from "../../../model/course/data/CourseStatus"
import {GradeEntity} from "../../../entity/common/grade.entity"
import {SubjectEntity} from "../../../entity/common/subject.entity"
import {CourseTypeEntity} from "../../../entity/course/courseType.entity"
import {TutorEntity} from "../../../entity/profile/tutor.entity"
import TutorProfile from "../../../model/profile/TutorProfile";

/**
 * Service for manage offline course data
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
export class OfflineCourseService {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Generate an offline course id
     * @param type
     * @param subject
     * @param grade
     * @private
     */
    private generateCourseId(type: CourseType, subject: Subject, grade: Grade): string {
        return `${subject}-${type}-${grade}-${uuidV4()}`
    }

    /**
     * Get a simple tutor profile data
     * (tutor id, introduction)
     * @param id
     * @private
     */
    private async getTutor(id: string): Promise<TutorEntity> {
        try {
            const tutorId = TutorProfile.getTutorId(id)
            return await this.connection.getRepository(TutorEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Create an offline course
     * @param tutorId
     * @param data
     */
    async createOfflineCourse(tutorId: string, data: OfflineCourseForm): Promise<string> {
        try {
            const courseId = this.generateCourseId(data.type, data.subject, data.grade)
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
            offlineCourse.owner = await this.getTutor(tutorId)

            await this.connection.getRepository(OfflineCourseEntity).save(offlineCourse)

            return courseId
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get an offline course data from database by using course id
     * @param courseId
     */
    async getOfflineCourseDetail(courseId: string): Promise<OfflineCourseEntity> {
        try {
            const offlineCourse = await this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                .leftJoinAndSelect("course.courseType", "type")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("course.rating", "rating")
                .leftJoinAndSelect("course.courseReview", "review")
                .leftJoinAndSelect("owner.member", "member")
                .where("course.id like :id")
                .setParameter("id", courseId)
                .getOne()
            return offlineCourse
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * For check the user who request a course data is an course owner
     * @param courseId
     * @param userId
     */
    async checkCourseOwner(courseId: string, userId: string): Promise<boolean> {
        try {
            const course = await this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                .leftJoinAndSelect("course.owner", "owner")
                .where("course.id like :courseId", { "courseId": courseId})
                .andWhere("owner.id like :ownerId", { "ownerId": TutorProfile.getTutorId(userId)})
                .getOne()
            return !!course
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Update an offline course data by using course id with a new course data
     * @param courseId
     * @param userId
     * @param data
     */
    async updateOfflineCourse(courseId: string, userId: string, data: OfflineCourseForm): Promise<OfflineCourseEntity> {
        try {
            const offlineCourseEntity = new OfflineCourseEntity()
            offlineCourseEntity.id = courseId
            offlineCourseEntity.name = data.name
            offlineCourseEntity.description = data.description
            offlineCourseEntity.cost = data.cost
            offlineCourseEntity.day = data.dayOfWeek
            offlineCourseEntity.startTime = data.startTime
            offlineCourseEntity.endTime = data.endTime
            offlineCourseEntity.status = CourseStatus.OPEN
            offlineCourseEntity.grade = GradeEntity.createFromGrade(data.grade)
            offlineCourseEntity.subject = SubjectEntity.createFromCode(data.subject)
            offlineCourseEntity.courseType = CourseTypeEntity.createFromType(data.type)

            await this.connection.getRepository(OfflineCourseEntity).save(offlineCourseEntity)

            return await this.getOfflineCourseDetail(courseId)
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

}