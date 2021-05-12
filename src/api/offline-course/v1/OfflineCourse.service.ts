import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { v4 as uuidV4 } from "uuid"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import { logger } from "../../../core/logging/Logger"
import { CourseType } from "../../../model/course/data/CourseType"
import { Subject } from "../../../model/common/data/Subject"
import { Grade } from "../../../model/common/data/Grade"
import { OfflineCourseEntity } from "../../../entity/course/offline/offlineCourse.entity"
import { CourseStatus } from "../../../model/course/data/CourseStatus"
import { GradeEntity } from "../../../entity/common/grade.entity"
import { SubjectEntity } from "../../../entity/common/subject.entity"
import { CourseTypeEntity } from "../../../entity/course/courseType.entity"
import TutorProfile from "../../../model/profile/TutorProfile"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { OfflineCourseLeanerRequestEntity } from "../../../entity/course/offline/offlineCourseLearnerRequest.entity"
import { LearnerEntity } from "../../../entity/profile/learner.entity"
import { EnrollStatus } from "../../../model/course/data/EnrollStatus"
import UserUtil from "../../../utils/UserUtil"
import { EnrollAction } from "../../../model/course/data/EnrollAction"
import { launch } from "../../../core/common/launch"
import OfflineCourseRepository from "../../../repository/OfflineCourseRepository"

/**
 * Service for manage offline course data
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
export class OfflineCourseService {
    constructor(
        private readonly connection: Connection,
        private readonly repository: OfflineCourseRepository,
        private readonly userManager: UserUtil
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
        return launch(async () => {
            const courseId = this.generateCourseId(data.type, data.subject, data.grade)
            const tutor = await this.userManager.getTutor(tutorId)

            await this.repository.createCourse(courseId, data, tutor)

            return courseId
        })
    }

    /**
     * Get an offline course data from database by using course id
     * @param courseId
     */
    async getOfflineCourseDetail(courseId: string): Promise<OfflineCourseEntity> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                .leftJoinAndSelect("course.courseType", "type")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("course.rating", "rating")
                .leftJoinAndSelect("owner.member", "member")
                .where("course.id like :id")
                .setParameter("id", courseId)
                .getOne()
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
                throw ErrorExceptions.create("The selected course is not available", CourseError.NOT_AVAILABLE)
            }
            return offlineCourse
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("The selected course is not available", CourseError.NOT_AVAILABLE)
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
            let enrolled = await this.checkEnrolledOfflineCourse(course.id, learnerEntity)

            if (enrolled === undefined) {
                enrolled = new OfflineCourseLeanerRequestEntity()
            } else if (enrolled.status === EnrollStatus.WAITING_FOR_APPROVE || enrolled.status === EnrollStatus.APPROVE) {
                return CourseError.ALREADY_ENROLL
            }

            course.requestNumber++

            enrolled.learner = learnerEntity
            enrolled.course = course
            enrolled.status = EnrollStatus.WAITING_FOR_APPROVE

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
                throw ErrorExceptions.create("Can not enroll this course", CourseError.CAN_NOT_ENROLL)
            } finally {
                await queryRunner.release()
            }

            return CourseError.ENROLL_SUCCESS
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get learner enroll list
     * @param courseId
     */
    async getEnrollOfflineCourseList(courseId: string): Promise<OfflineCourseLeanerRequestEntity[]> {
        try {
            return await this.connection.createQueryBuilder(OfflineCourseLeanerRequestEntity, "courseRequest")
                .leftJoinAndSelect("courseRequest.learner", "learner")
                .leftJoinAndSelect("learner.member", "member")
                .where("courseRequest.course.id like :id", {id: courseId})
                .andWhere("courseRequest.status in (:status)", {status: [EnrollStatus.WAITING_FOR_APPROVE, EnrollStatus.APPROVE]})
                .getMany()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Tutor manage a leaner enroll course request
     * @param course
     * @param tutorId
     * @param learnerId
     * @param action - param for manage action "approve" or "denied"
     */
    async manageEnrollRequest(course: OfflineCourseEntity, tutorId: string, learnerId: string, action: string): Promise<string> {
        try {
            await this.userManager.getTutor(tutorId)
            const learner = await this.userManager.getLearner(learnerId)
            const enrolled = await this.checkEnrolledOfflineCourse(course.id, learner)

            if (!enrolled) {
                logger.error("Can not find enrolled learner with id " + learnerId)
                return "Can not find enrolled learner with id " + learnerId
            } else if (enrolled.status !== EnrollStatus.WAITING_FOR_APPROVE) {
                logger.error("Learner with id " + learnerId + " already enroll your course")
                return "You already have action with this request"
            }

            switch (action) {
                case EnrollAction.APPROVE:
                    enrolled.status = EnrollStatus.APPROVE
                    course.requestNumber--
                    course.studentNumber++
                    break
                case EnrollAction.DENIED:
                    enrolled.status = EnrollStatus.DENIED
                    course.requestNumber--
                    break
                default:
                    enrolled.status = EnrollStatus.WAITING_FOR_APPROVE
                    break
            }

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
                throw ErrorExceptions.create("Can not make action with this request", CourseError.CAN_NOT_ENROLL)
            } finally {
                await queryRunner.release()
            }

            return "Successfully, Learner with ID: " + learnerId + " was " + action + "."
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

}