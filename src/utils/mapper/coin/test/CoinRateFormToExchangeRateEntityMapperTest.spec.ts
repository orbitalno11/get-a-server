import CoinRateForm from "../../../../model/coin/CoinRateForm";
import {ExchangeRateEntity} from "../../../../entity/coins/exchangeRate.entity";
import {CoinRateType} from "../../../../model/coin/data/CoinRateType";
import {CoinRateFormToExchangeRateEntityMapper} from "../CoinRateFormToExchangeRateEntityMapper";
import * as MockDate from "mockdate";

describe("Coin rate form to exchange rate entity mapper", () => {
    test("map success", () => {
        MockDate.set("1998-12-11")
        const startDate = new Date()
        const endDate = new Date()
        const updated = new Date()
        const testValue = new CoinRateForm()
        testValue.title = "test-title"
        testValue.baht = 1.0
        testValue.coin = 1.0
        testValue.type = CoinRateType.STANDARD
        testValue.startDate = startDate
        testValue.endDate = endDate

        const expectedValue = new ExchangeRateEntity()
        expectedValue.title = "test-title"
        expectedValue.baht = 1.0
        expectedValue.coin = 1.0
        expectedValue.type = CoinRateType.STANDARD
        expectedValue.startDate = startDate
        expectedValue.endDate = endDate
        expectedValue.updated = updated

        const actualValue = CoinRateFormToExchangeRateEntityMapper(testValue)
        expect(actualValue).toEqual(expectedValue)
    })
})