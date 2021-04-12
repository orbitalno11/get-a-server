import CoinRateForm from "../../../model/coin/CoinRateForm";
import {ExchangeRateEntity} from "../../../entity/coins/exchangeRate.entity";

export const CoinRateFormToExchangeRateEntityMapper = (from: CoinRateForm): ExchangeRateEntity => {
    const out = new ExchangeRateEntity()
    out.title = from.title
    out.baht = from.baht
    out.coin = from.coin
    out.type = from.type
    out.startDate = from.startDate
    out.endDate = from.endDate
    out.updated = new Date()
    return out
}