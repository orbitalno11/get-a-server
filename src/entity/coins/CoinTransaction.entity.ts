import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm"
import { MemberEntity } from "../member/member.entitiy"
import { ClipTransactionEntity } from "../course/clip/ClipTransaction.entity"

@Entity("coin_transaction")
export class CoinTransactionEntity {
    @PrimaryColumn({ name: "transaction_id" })
    transactionId: string

    @Column({ name: "transaction_type" })
    transactionType: number

    @Column({ name: "number_of_coin" })
    numberOfCoin: number

    @Column({ name: "transaction_date" })
    transactionDate: Date

    // entity relation
    @ManyToOne(
        () => MemberEntity,
        (member) => member.coinTransaction
    )
    @JoinColumn({ name: "member_id" })
    member: MemberEntity

    @OneToOne(
        () => ClipTransactionEntity,
        (paidClip) => paidClip.transaction
    )
    paidClip: ClipTransactionEntity
}