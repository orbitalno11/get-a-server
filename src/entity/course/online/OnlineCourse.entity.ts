import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { TutorEntity } from "../../profile/tutor.entity"
import { SubjectEntity } from "../../common/subject.entity"
import { GradeEntity } from "../../common/grade.entity"
import { OnlineCourseRatingEntity } from "./OnlineCourseRating.entity"
import { ClipEntity } from "../clip/Clip.entity"
import { OnlineCourseStatisticEntity } from "./OnlineCourseStatistic.entity"

@Entity("online_course")
export class OnlineCourseEntity {
    @PrimaryColumn()
    id: string

    @Column({ name: "courseName" })
    name: string

    @Column({ name: "courseCoverUrl" })
    coverUrl: string

    // entity relation
    @ManyToOne(
        () => TutorEntity,
        (tutor) => tutor.onlineCourse
    )
    @JoinColumn({ name: "ownerId" })
    owner: TutorEntity

    @ManyToOne(
        () => SubjectEntity,
        (subject) => subject.onlineCourse
    )
    @JoinColumn({ name: "subjectCode" })
    subject: SubjectEntity

    @ManyToOne(
        () => GradeEntity,
        (grade) => grade.onlineCourse
    )
    @JoinColumn({ name: "gradeId" })
    grade: GradeEntity

    @OneToOne(
        () => OnlineCourseRatingEntity,
        (course) => course.onlineCourse
    )
    rating: OnlineCourseRatingEntity

    @OneToOne(
        () => OnlineCourseStatisticEntity,
        (statistic) => statistic.onlineCourse,
        { cascade: ["insert"] }
    )
    statistic: OnlineCourseStatisticEntity

    @OneToMany(
        () => ClipEntity,
        (clip) => clip.onlineCourse
    )
    clips: ClipEntity[]
}