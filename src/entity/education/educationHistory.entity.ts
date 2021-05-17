import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { TutorEntity } from "../profile/tutor.entity"
import { BranchEntity } from "./branch.entity"
import { InstituteEntity } from "./institute.entity"
import { UserVerifyEntity } from "../UserVerify.entity"
import { GradeEntity } from "../common/grade.entity"

@Entity("education_history")
export class EducationHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    gpax: number

    @Column()
    status: string

    @Column()
    verified: number

    // entity relation
    @ManyToOne(
        () => TutorEntity,
        (tutor) => tutor.educationHistory)
    @JoinColumn({ name: "tutorId" })
    tutor: TutorEntity

    @ManyToOne(
        () => InstituteEntity,
        (institute) => institute.educationHistory)
    @JoinColumn({ name: "instituteId" })
    institute: InstituteEntity

    @ManyToOne(
        () => BranchEntity,
        (branch) => branch.educationHistory)
    @JoinColumn({ name: "branchId" })
    branch: BranchEntity

    @ManyToOne(
        () => GradeEntity,
        (grade) => grade.education
    )
    @JoinColumn({ name: "gradeId" })
    grade: GradeEntity

    @OneToOne(() => UserVerifyEntity, { cascade: true })
    @JoinColumn({ name: "verified_id" })
    verifiedData: UserVerifyEntity
}