import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ExchangeTransactionEntity } from "./exchangeTransaction.entity"
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

    // entity relation
    @OneToMany(
        () => ExchangeTransactionEntity,
        (transaction) => transaction.exchangeRate
    )
    exchangeTransaction: ExchangeTransactionEntity[]

    @OneToMany(
        () => PaymentTransactionEntity,
        (transaction) => transaction.exchangeRate
    )
    paymentTransaction: PaymentTransactionEntity[]
}