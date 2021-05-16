import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MemberEntity } from "../member/member.entitiy"

@Entity("coin")
export class CoinEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: number

    @Column({ default: new Date() })
    updated: Date

    // entity relation
    @OneToOne(() => MemberEntity)
    @JoinColumn({ name: "memberId" })
    member: MemberEntity
}