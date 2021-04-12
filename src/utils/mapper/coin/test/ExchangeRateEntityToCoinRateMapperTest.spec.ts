import {ExchangeRateEntity} from "../../../../entity/coins/exchangeRate.entity";
import {CoinRateType} from "../../../../model/coin/data/CoinRateType";
import * as MockDate from "mockdate";
import CoinRate from "../../../../model/coin/CoinRate"
import {ExchangeRateEntityToCoinRateMapper} from "../ExchangeRateEntityToCoinRateMapper"

describe("exchange rate entity to coin rate mapper", () => {
    test("map success", () => {
        MockDate.set("1998-12-11")
        const startDate = new Date()
        const endDate = new Date()
        const updated = new Date()
        const testValue = new ExchangeRateEntity()
        testValue.title = "test-title"
        testValue.baht = 1.0
        testValue.coin = 1.0
        testValue.type = CoinRateType.STANDARD
        testValue.startDate = startDate
        testValue.endDate = endDate
        testValue.updated = updated

        const expectedValue = new CoinRate()
        expectedValue.title = "test-title"
        expectedValue.baht = 1.0
        expectedValue.coin = 1.0
        expectedValue.type = CoinRateType.STANDARD
        expectedValue.startDate = startDate
        expectedValue.endDate = endDate
        expectedValue.updateDate = updated

        const actualValue = ExchangeRateEntityToCoinRateMapper(testValue)
        expect(actualValue).toEqual(expectedValue)
    })
})