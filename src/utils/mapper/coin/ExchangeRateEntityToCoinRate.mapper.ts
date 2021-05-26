import {ExchangeRateEntity} from "../../../entity/coins/exchangeRate.entity";
import CoinRate from "../../../model/coin/CoinRate";

/**
 * Mapper for transform entity to class
 * @author orbitalno11 2021 A.D.
 * @param from
 * @constructor
 */
export const ExchangeRateEntityToCoinRateMapper = (from: ExchangeRateEntity): CoinRate => {
    const out = new CoinRate()
    out.id = from.id
    out.title = from.title
    out.baht = from.baht
    out.coin = from.coin
    out.type = from.type
    out.startDate = from.startDate
    out.endDate = from.endDate
    out.updateDate = from.updated
    return out
}