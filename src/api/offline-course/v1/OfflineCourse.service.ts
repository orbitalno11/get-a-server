import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { v4 as uuidV4 } from "uuid"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import { logger } from "../../../core/logging/Logger"
import { CourseType } from "../../../model/course/CourseType"
import { Subject } from "../../../model/common/Subject"
import { Grade } from "../../../model/common/Grade"
import { OfflineCourseEntity } from "../../../entity/course/offline/offlineCourse.entity"
import { CourseStatus } from "../../../model/course/CourseStatus"
import { GradeEntity } from "../../../entity/common/grade.entity"
import { SubjectEntity } from "../../../entity/common/subject.entity"
import { CourseTypeEntity } from "../../../entity/course/courseType.entity"
import { TutorEntity } from "../../../entity/profile/tutor.entity"

@Injectable()
export class OfflineCourseService {
  constructor(private readonly connection: Connection) {
  }

  private generateCourseId(type: CourseType, subject: Subject, grade: Grade): string {
    return `${subject}-${type}-${grade}-${uuidV4()}`
  }

  private async getTutor(id: string): Promise<TutorEntity> {
    try {
      return  await this.connection.getRepository(TutorEntity).findOne(id)
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
}