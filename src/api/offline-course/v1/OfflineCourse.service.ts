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
import TutorProfile from "../../../model/profile/TutorProfile";
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions";
import {CourseError} from "../../../model/course/data/CourseError";
import {isEmpty} from "../../../core/extension/CommonExtension";
import {OfflineCourseLeanerRequestEntity} from "../../../entity/course/offline/offlineCourseLearnerRequest.entity";
import {LearnerEntity} from "../../../entity/profile/learner.entity";
import {EnrollStatus} from "../../../model/course/data/EnrollStatus";
import UserManager from "../../../utils/UserManager";
import UserErrorType from "../../../core/exceptions/model/UserErrorType";
import {TutorEntity} from "../../../entity/profile/tutor.entity";

/**
 * Service for manage offline course data
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
export class OfflineCourseService {
    constructor(
        private readonly connection: Connection,
        private readonly userManager: UserManager
    ) {
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
     * Create an offline course
     * @param tutorId
     * @param data
     */
    async createOfflineCourse(tutorId: string, data: OfflineCourseForm): Promise<string> {
        try {
            const courseId = this.generateCourseId(data.type, data.subject, data.grade)
            const tutor = await this.userManager.getTutor(tutorId)

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
                .where("course.id like :courseId", {"courseId": courseId})
                .andWhere("owner.id like :ownerId", {"ownerId": TutorProfile.getTutorId(userId)})
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
            await this.userManager.getTutor(userId)

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

    /**
     * Check a selected course is available (course status is "open")
     * @param courseId
     */
    async checkOfflineCourseAvailable(courseId: string): Promise<OfflineCourseEntity> {
        try {
            const offlineCourse = await this.connection.getRepository(OfflineCourseEntity).findOne(courseId)
            if (isEmpty(offlineCourse) || offlineCourse.status !== CourseStatus.OPEN) {
                throw ErrorExceptions.create("The selected course is not available", CourseError.COURSE_NOT_AVAILABLE)
            }
            return offlineCourse
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("The selected course is not available", CourseError.COURSE_NOT_AVAILABLE)
        }
    }

    /**
     * Check user already send the enroll request for course
     * @param courseId
     * @param learner
     * @private
     */
    private async checkEnrolledOfflineCourse(courseId: string, learner: LearnerEntity): Promise<OfflineCourseLeanerRequestEntity> {
        try {
            return await this.connection.getRepository(OfflineCourseLeanerRequestEntity).findOne({
                where: {course: courseId, learner: learner}
            })
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Enroll offline course
     * @param course
     * @param userId
     */
    async enrollOfflineCourse(course: OfflineCourseEntity, userId: string): Promise<string> {
        try {
            const learnerEntity = await this.userManager.getLearner(userId)
            const enrolled = await this.checkEnrolledOfflineCourse(course.id, learnerEntity)

            if (!!enrolled) {
                return "Sorry, You already sent a request for enroll this course. Please, waiting for tutor approve your request."
            }

            course.requestNumber++

            const requestCourseEntity = new OfflineCourseLeanerRequestEntity()
            requestCourseEntity.learner = learnerEntity
            requestCourseEntity.course = course
            requestCourseEntity.status = EnrollStatus.WAITING_FOR_APPROVE

            // update entity
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(requestCourseEntity)
                await queryRunner.manager.save(course)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not enroll this course", CourseError.CAN_NOT_ENROLL_COURSE)
            } finally {
                await queryRunner.release()
            }

            return "Successfully, You sent a request for enroll this course."
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async acceptEnrollRequest(course: OfflineCourseEntity, tutorId: string, learnerId: string) {
        try {
            await this.userManager.getTutor(tutorId)
            const learner = await this.userManager.getLearner(learnerId)
            const enrolled = await this.checkEnrolledOfflineCourse(course.id, learner)

            if (!enrolled) {
                logger.error("Can not find enrolled learner with id " + learnerId)
                return "Can not find enrolled learner with id " + learnerId
            } else if (enrolled.status !== EnrollStatus.WAITING_FOR_APPROVE) {
                logger.error("Learner with id " + learnerId + " already enroll your course")
                return "Learner with id " + learnerId + " already enroll your course"
            }

            course.requestNumber--
            course.studentNumber++
            enrolled.status = EnrollStatus.APPROVE

            // update entity
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(enrolled)
                await queryRunner.manager.save(course)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can accept this request", CourseError.CAN_NOT_ENROLL_COURSE)
            } finally {
                await queryRunner.release()
            }

            return "Successfully, Learner with ID: " + learnerId + " enrolled to your course."
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

}