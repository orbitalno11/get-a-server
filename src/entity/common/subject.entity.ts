import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { OfflineCourseEntity } from '../course/offline/offlineCourse.entity'
import { InterestedSubjectEntity } from '../member/interestedSubject.entity'
import { Subject } from "../../model/common/data/Subject"
import { TestingHistoryEntity } from "../education/testingHistory.entity"

@Entity('subject')
export class SubjectEntity {
  @PrimaryColumn()
  code: string

  @Column()
  title: string

  // entity relation
  @OneToMany(
    () => InterestedSubjectEntity,
    (interestedSubject) => interestedSubject.subject
  )
  interestedSubject: InterestedSubjectEntity[]

  @OneToMany(
    () => OfflineCourseEntity,
    (offlineCourse) => offlineCourse.subject
  )
  offlineCourse: OfflineCourseEntity[]

  @OneToMany(
      () => TestingHistoryEntity,
      (testing) => testing.subject
  )
  testingHistory: TestingHistoryEntity[]

  // static method
  public static create(code: string, title: string): SubjectEntity {
    const subject = new SubjectEntity()
    subject.code = code
    subject.title = title
    return subject
  }

  public static createFromCode(code: Subject): SubjectEntity {
    const subject = new SubjectEntity()
    subject.code = code
    return subject
  }
}
