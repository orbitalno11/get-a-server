import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { OfflineCourseEntity } from '../course/offline/offlineCourse.entity'
import { Grade } from "../../model/common/data/Grade"
import { EducationHistoryEntity } from "../education/educationHistory.entity"

@Entity('grade')
export class GradeEntity {
  @PrimaryColumn()
  grade: number

  @Column()
  title: string

  // entity relation
  @OneToMany(() => OfflineCourseEntity, (offlineCourse) => offlineCourse.grade)
  offlineCourse: OfflineCourseEntity[]

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
