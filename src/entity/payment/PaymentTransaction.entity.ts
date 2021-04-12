import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { MemberEntity } from "../member/member.entitiy"
import { PaymentStatus } from "../../model/payment/data/PaymentStatus"
import { ExchangeRateEntity } from "../coins/exchangeRate.entity"

@Entity("payment_transaction")
export class PaymentTransactionEntity {
    @PrimaryColumn({ name: "transaction_id" })
    transactionId: string

    @Column()
    paymentTransId: string

    @Column()
    amount: number

    @Column({ default: PaymentStatus.WAITING_FOR_PAYMENT })
    paymentStatus: number

    @Column()
    created: Date

    @Column({ default: new Date() })
    updated: Date = new Date()

    @Column()
    refNo1: string

    @Column()
    refNo2: string

    @Column()
    refNo3: string

    // entity relation
    @ManyToOne(
        () => MemberEntity,
        (member) => member.paymentTransaction)
    @JoinColumn({ name: "memberId" })
    member: MemberEntity

    @ManyToOne(
        () => ExchangeRateEntity,
        (rate) => rate.paymentTransaction
    )
    @JoinColumn({ name: "exchangeRateId" })
    exchangeRate: ExchangeRateEntity
}