import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { RedeemTransactionEntity } from "../coins/RedeemTransaction.entity"

@Entity("bank")
export class BankEntity {
    @PrimaryColumn()
    id: string

    @Column()
    title: string

    // entity relation
    @OneToMany(
        () => RedeemTransactionEntity,
        (transaction) => transaction.bank
    )
    transaction: RedeemTransactionEntity[]
}