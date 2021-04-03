import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm"
import { MemberEntity } from "./member.entitiy"
import { SubjectEntity } from "../common/subject.entity"

@Entity("interested_subject")
export class InterestedSubjectEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  subjectRank: number

  @ManyToOne(() => MemberEntity, (member) => member.interestedSubject)
  @JoinColumn()
  member: MemberEntity

  @ManyToOne(() => SubjectEntity, (subject) => subject)
  @JoinColumn({ "name": "subjectCode" })
  subject: SubjectEntity
}
