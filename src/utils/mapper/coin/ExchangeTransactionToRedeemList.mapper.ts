import { RedeemTransactionEntity } from "../../../entity/coins/RedeemTransaction.entity"
import RedeemTransaction from "../../../model/coin/RedeemTransaction"
import { ExchangeRateEntityToCoinRateMapper } from "./ExchangeRateEntityToCoinRate.mapper"

/**
 * Mapper for Exchange transaction
 * @author orbitalno11 2021 A.D.
 */

/**
 * Mapper for Exchange transaction list to redeem list
 * @param from
 * @constructor
 */
export const ExchangeTransactionToRedeemListMapper = (from: RedeemTransactionEntity[]): RedeemTransaction[] => {
    return from.map((item) => ExchangeTransactionToRedeemMapper(item))
}


/**
 * Mapper for Exchange transaction item to redeem item
 * @param from
 * @constructor
 */
export const ExchangeTransactionToRedeemMapper = (from: RedeemTransactionEntity): RedeemTransaction => {
    const redeem = new RedeemTransaction()
    redeem.id = from.id
    redeem.amount = from.amount
    redeem.amountCoin = from.amountCoin
    redeem.requestDate = from.requestDate
    redeem.approveDate = from.approveDate
    redeem.transferDate = from.transferDate
    redeem.status = from.requestStatus
    return redeem
}