import {ExchangeRateEntity} from "../../../entity/coins/exchangeRate.entity";
import CoinRate from "../../../model/coin/CoinRate";

export const ExchangeRateEntityToCoinRateMapper = (from: ExchangeRateEntity): CoinRate => {
    const out = new CoinRate()
    out.title = from.title
    out.baht = from.baht
    out.coin = from.coin
    out.type = from.type
    out.startDate = from.startDate
    out.endDate = from.endDate
    out.updateDate = from.updated
    return out
}