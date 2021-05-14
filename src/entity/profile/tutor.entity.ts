import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ContactEntity } from "../contact/contact.entitiy"
import { OfflineCourseEntity } from "../course/offline/offlineCourse.entity"
import { EducationHistoryEntity } from "../education/educationHistory.entity"
import { TestingHistoryEntity } from "../education/testingHistory.entity"
import { FavoriteTutorEntity } from "../favoriteTutor.entity"
import { MemberEntity } from "../member/member.entitiy"
import { TutorStatisticEntity } from "../analytic/TutorStatistic.entity"

@Entity("tutor_profile")
export class TutorEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    introduction: string

    // entity relation
    @OneToOne(() => MemberEntity)
    @JoinColumn()
    member: MemberEntity

    @OneToOne(() => ContactEntity)
    @JoinColumn()
    contact: ContactEntity

    @OneToMany(() => FavoriteTutorEntity, (favorite) => favorite.tutor)
    wasFavoriteBy: FavoriteTutorEntity[]

    @OneToMany(() => TestingHistoryEntity, (testing) => testing.tutor)
    testingHistory: TestingHistoryEntity[]

    @OneToMany(() => EducationHistoryEntity, (education) => education.tutor)
    educationHistory: EducationHistoryEntity[]

    @OneToMany(() => OfflineCourseEntity, (offlineCourse) => offlineCourse.owner)
    offlineCourse: OfflineCourseEntity[]

    @OneToOne(() => TutorStatisticEntity, (stat) => stat.tutor)
    statistic: TutorStatisticEntity
}