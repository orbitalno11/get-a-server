import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { OfflineCourseEntity } from '../course/offline/offlineCourse.entity'
import { Grade } from "../../model/common/Grade"

@Entity('grade')
export class GradeEntity {
  @PrimaryColumn()
  grade: number

  @Column()
  title: string

  // entity relation
  @OneToMany(() => OfflineCourseEntity, (offlineCourse) => offlineCourse.grade)
  offlineCourse: OfflineCourseEntity[]

  // static method
  public static createFromGrade(grade: Grade): GradeEntity {
    const out = new GradeEntity()
    out.grade = grade
    return out
  }
}
