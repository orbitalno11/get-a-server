import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MemberEntity } from "../member/member.entitiy"
import { ExchangeRateEntity } from "./exchangeRate.entity"

@Entity("exchange_transaction")
export class ExchangeTransactionEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    requestDate: Date

    @Column()
    approveDate: Date

    @Column()
    transferDate: Date

    // entity relation
    @ManyToOne(() => MemberEntity, (member) => member.exchangeTransaction)
    @JoinColumn({ name: "memberId" })
    member: MemberEntity

    @ManyToOne(() => ExchangeRateEntity, (exchangeRate) => exchangeRate.exchangeTransaction)
    @JoinColumn({ name: "exchangeRateId" })
    exchangeRate: ExchangeRateEntity
}