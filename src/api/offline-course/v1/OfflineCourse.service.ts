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

@Injectable()
export class OfflineCourseService {
    constructor(private readonly connection: Connection) {
    }

    private generateCourseId(type: CourseType, subject: Subject, grade: Grade): string {
        return `${subject}-${type}-${grade}-${uuidV4()}`
    }

    private async getTutor(id: string): Promise<TutorEntity> {
        try {
            const tutorId = `tutor-${id}`
            return await this.connection.getRepository(TutorEntity).findOne(tutorId)
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

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
                .leftJoinAndSelect("owner.contact", "contact")
                .where("course.id like :id")
                .setParameter("id", courseId)
                .getOne()
            return offlineCourse
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

}