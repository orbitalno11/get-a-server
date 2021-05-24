import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { OfflineCourseEntity } from '../course/offline/offlineCourse.entity'
import { Grade } from "../../model/common/data/Grade"
import { EducationHistoryEntity } from "../education/educationHistory.entity"
import { OnlineCourseEntity } from "../course/online/OnlineCourse.entity"

@Entity('grade')
export class GradeEntity {
  @PrimaryColumn()
  grade: number

  @Column()
  title: string

  // entity relation
  @OneToMany(
      () => OfflineCourseEntity,
      (course) => course.grade)
  offlineCourse: OfflineCourseEntity[]

  @OneToMany(
      () => OnlineCourseEntity,
      (course) => course.grade
  )
  onlineCourse: OnlineCourseEntity[]

  @OneToMany(
      () => EducationHistoryEntity,
      (education) => education.grade
  )
  education: EducationHistoryEntity

  // static method
  public static createFromGrade(grade: Grade): GradeEntity {
    const out = new GradeEntity()
    out.grade = grade
    return out
  }
}
