import { CoinTransactionEntity } from "../../../entity/coins/coinTransaction.entity"
import CoinPaymentTransaction from "../../../model/payment/CoinPaymentTransaction"
import { ExchangeRateEntityToCoinRateMapper } from "../coin/ExchangeRateEntityToCoinRateMapper"

/**
 * Mapper for transform entity to model
 * @author orbitalno11 2021 A.D.
 * @param from
 * @constructor
 */
export const CoinTransactionToPaymentMapper = (from: CoinTransactionEntity): CoinPaymentTransaction => {
    const out = new CoinPaymentTransaction()
    out.transactionId = from.transactionId
    out.paymentId = from.paymentId
    out.transactionDate = from.transactionDate
    out.paymentDetail = ExchangeRateEntityToCoinRateMapper(from.exchangeRate)
    out.paymentStatus = from.paymentStatus
    return out
}