import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MemberEntity } from "../member/member.entitiy"
import { ExchangeRateEntity } from "./exchangeRate.entity"
import { BankEntity } from "../common/Bank.entity"

@Entity("redeem_transaction")
export class RedeemTransactionEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "account_no" })
    accountNo: string

    @Column({ name: "account_name" })
    accountName: string

    @Column({ name: "account_pic" })
    accountPic: string

    @Column({ name: "amount" })
    amount: number

    @Column({ name: "amount_coin" })
    amountCoin: number

    @Column({ name: "request_date" })
    requestDate: Date

    @Column({ name: "approve_date" })
    approveDate: Date

    @Column({ name: "transfer_date" })
    transferDate: Date

    @Column({ name: "request_status" })
    requestStatus: number

    // entity relation
    @ManyToOne(() => MemberEntity, (member) => member.exchangeTransaction)
    @JoinColumn({ name: "member_id" })
    member: MemberEntity

    @ManyToOne(() => ExchangeRateEntity, (exchangeRate) => exchangeRate.exchangeTransaction)
    @JoinColumn({ name: "rate_id" })
    exchangeRate: ExchangeRateEntity

    @ManyToOne(() => BankEntity, (bank) => bank.transaction)
    @JoinColumn({ name: "bank_id" })
    bank: BankEntity
}