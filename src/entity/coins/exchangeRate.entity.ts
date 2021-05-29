import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { RedeemTransactionEntity } from "./RedeemTransaction.entity"
import { PaymentTransactionEntity } from "../payment/PaymentTransaction.entity"

@Entity("exchange_rate")
export class ExchangeRateEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    baht: number

    @Column()
    coin: number

    @Column()
    type: string

    @Column({ default: new Date() })
    startDate: Date

    @Column()
    endDate: Date

    @Column({ default: new Date() })
    updated: Date

    @Column()
    active: boolean

    // entity relation
    @OneToMany(
        () => RedeemTransactionEntity,
        (transaction) => transaction.exchangeRate
    )
    exchangeTransaction: RedeemTransactionEntity[]

    @OneToMany(
        () => PaymentTransactionEntity,
        (transaction) => transaction.exchangeRate
    )
    paymentTransaction: PaymentTransactionEntity[]
}