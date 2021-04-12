import { PaymentTransactionEntity } from "../../../entity/payment/PaymentTransaction.entity"
import CoinPayment from "../../../model/payment/CoinPayment"

/**
 * Mapper for transform entity to model
 * @author orbitalno11 2021 A.D.
 * @param from
 * @constructor
 */
export const PaymentTransactionToCoinPayment = (from: PaymentTransactionEntity): CoinPayment => {
    const out = new CoinPayment()
    out.transactionId = from.transactionId
    out.paymentTransId = from.paymentTransId
    out.amount = Number(from.amount)
    out.userId = from.member?.id
    out.coinRate = Number(from.exchangeRate?.id)
    out.status = Number(from.paymentStatus)
    out.created = from.created
    out.updated = from.updated
    out.refNo1 = from.refNo1
    out.refNo2 = from.refNo2
    out.refNo3 = from.refNo3
    return out
}