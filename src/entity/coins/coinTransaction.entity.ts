import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { MemberEntity } from "../member/member.entitiy"
import { ExchangeRateEntity } from "./exchangeRate.entity"
import { PaymentStatus } from "../../model/payment/data/PaymentStatus"

@Entity("coin_transaction")
export class CoinTransactionEntity {
    @PrimaryColumn({ name: "transaction_id" })
    transactionId: string

    @Column()
    paymentId: number

    @Column({ default: new Date() })
    transactionDate: Date

    @Column({ default: PaymentStatus.WAITING_FOR_PAYMENT })
    paymentStatus: number

    // entity relation
    @ManyToOne(
        () => MemberEntity,
        (member) => member.coinTransaction)
    @JoinColumn({ name: "memberId" })
    member: MemberEntity

    @ManyToOne(
        () => ExchangeRateEntity,
        (rate) => rate.coinTransaction
    )
    @JoinColumn({ name: "exchangeRateId" })
    exchangeRate: ExchangeRateEntity
}