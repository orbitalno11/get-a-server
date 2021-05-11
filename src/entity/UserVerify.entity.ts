import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import { MemberEntity } from "./member/member.entitiy"
import { EducationHistoryEntity } from "./education/educationHistory.entity"
import { TestingHistoryEntity } from "./education/testingHistory.entity"

@Entity("user_verify")
export class UserVerifyEntity {
    @PrimaryColumn()
    id: string

    @Column()
    documentUrl1: string | null

    @Column()
    documentUrl2: string | null

    @Column()
    documentUrl3: string | null

    @Column({ name: "verify_type" })
    type: number

    @Column({ default: new Date() })
    created: Date

    @Column({ default: new Date() })
    updated: Date = new Date()

    // entity relation
    @ManyToOne(
        () => MemberEntity,
        (member) => member.verifyRequest
    )
    @JoinColumn({ name: "member_id" })
    member: MemberEntity

    @OneToOne(() => EducationHistoryEntity, (education) => education.verifiedData)
    educationHistory: EducationHistoryEntity

    @OneToOne(() => TestingHistoryEntity, (testing) => testing.verifiedData)
    testingHistory: TestingHistoryEntity
}