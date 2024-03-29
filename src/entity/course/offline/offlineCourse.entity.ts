import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm"
import {GradeEntity} from "../../common/grade.entity"
import {SubjectEntity} from "../../common/subject.entity"
import {TutorEntity} from "../../profile/tutor.entity"
import {CourseTypeEntity} from "../courseType.entity"
import {OfflineCourseLeanerRequestEntity} from "./offlineCourseLearnerRequest.entity"
import {OfflineCourseRatingTransactionEntity} from "./offlineCourseRatingTransaction.entity"
import { OfflineCourseStatisticEntity } from "./OfflineCourseStatistic.entity"

@Entity("course")
export class OfflineCourseEntity {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    cost: number

    @Column()
    day: number

    @Column()
    startTime: string

    @Column()
    endTime: string

    @Column()
    status: string

    @Column()
    requestNumber: number

    @Column()
    studentNumber: number

    @Column()
    created: Date

    @Column()
    updated: Date

    // entity relation attribute
    @ManyToOne(
        () => TutorEntity,
        (tutor) => tutor.offlineCourse
    )
    @JoinColumn({name: "ownerId"})
    owner: TutorEntity

    @ManyToOne(
        () => CourseTypeEntity,
        (type) => type.offlineCourse
    )
    @JoinColumn({name: "courseTypeId"})
    courseType: CourseTypeEntity

    @ManyToOne(
        () => SubjectEntity,
        (subject) => subject.offlineCourse
    )
    @JoinColumn({name: "subjectCode"})
    subject: SubjectEntity

    @ManyToOne(
        () => GradeEntity,
        (grade) => grade.offlineCourse
    )
    @JoinColumn({name: "gradeId"})
    grade: GradeEntity

    // entity relation
    @OneToOne(
        () => OfflineCourseStatisticEntity,
        (statistic) => statistic.course,
        { cascade: ["insert"] }
    )
    statistic: OfflineCourseStatisticEntity

    @OneToMany(
        () => OfflineCourseRatingTransactionEntity,
        (rating) => rating.course
    )
    courseReview: OfflineCourseRatingTransactionEntity[]

    @OneToMany(
        () => OfflineCourseLeanerRequestEntity,
        (request) => request.course
    )
    requestList: OfflineCourseLeanerRequestEntity[]
}