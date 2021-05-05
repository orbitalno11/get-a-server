import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { MemberEntity } from "./member/member.entitiy"

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

    // entity relation
    @ManyToOne(
        () => MemberEntity,
        (member) => member.verifyRequest
    )
    @JoinColumn({ name: "member_id" })
    member: MemberEntity
}