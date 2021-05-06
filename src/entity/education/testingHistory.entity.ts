import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { TutorEntity } from "../profile/tutor.entity"
import { ExamTypeEntity } from "./examType.entity"
import { SubjectEntity } from "../common/subject.entity"
import { UserVerifyEntity } from "../UserVerify.entity"

@Entity("testing_history")
export class TestingHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    testingScore: number

    @Column()
    verified: number

    @Column()
    year: string

    // entity relation
    @ManyToOne(() => TutorEntity, (tutor) => tutor.testingHistory)
    @JoinColumn({ name: "tutorId" })
    tutor: TutorEntity

    @ManyToOne(() => ExamTypeEntity, (exam) => exam.testingHistory)
    @JoinColumn({ name: "examId" })
    exam: ExamTypeEntity

    @ManyToOne(() => SubjectEntity, (subject) => subject.testingHistory)
    @JoinColumn({ name: "subject_code" })
    subject: SubjectEntity

    @OneToOne(() => UserVerifyEntity, { cascade: true })
    @JoinColumn({ name: "verified_id" })
    verifiedData: UserVerifyEntity
}