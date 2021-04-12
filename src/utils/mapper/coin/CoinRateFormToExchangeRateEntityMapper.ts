import CoinRate from "../../../model/coin/CoinRate";
import {ExchangeRateEntity} from "../../../entity/coins/exchangeRate.entity";

/**
 * Mapper function for transform CoinRate to ExchangeRateEntity
 * @author oribitalno11 2021 A.D.
 * @param from
 * @constructor
 */
export const CoinRateFormToExchangeRateEntityMapper = (from: CoinRate): ExchangeRateEntity => {
    const out = new ExchangeRateEntity()
    out.title = from.title
    out.baht = from.baht
    out.coin = from.coin
    out.type = from.type
    out.startDate = from.startDate
    out.endDate = from.endDate
    out.updated = from.updateDate
    return out
}