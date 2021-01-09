import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { OfflineCourseEntity } from './offline/offlineCourse.entity'
import { CourseType } from "../../model/course/CourseType"

@Entity('course_type')
export class CourseTypeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  // static method
  public static create(id: number, title: string): CourseTypeEntity {
    const courseType = new CourseTypeEntity()
    courseType.id = id
    courseType.title = title
    return courseType
  }

  public static createFromType(type: CourseType): CourseTypeEntity {
    const courseType = new CourseTypeEntity()
    courseType.id = type
    return courseType
  }

  // entity relation
  @OneToMany(() => OfflineCourseEntity, (offlineCourse) => offlineCourse.courseType)
  offlineCourse: OfflineCourseEntity[]
}