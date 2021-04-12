import {Injectable} from "@nestjs/common";
import {Connection} from "typeorm";
import CoinRateForm from "../../model/coin/CoinRateForm";
import {logger} from "../../core/logging/Logger";
import {ExchangeRateEntity} from "../../entity/coins/exchangeRate.entity";
import {CoinRateFormToExchangeRateEntityMapper} from "../../utils/mapper/coin/CoinRateFormToExchangeRateEntityMapper";
import ErrorExceptions from "../../core/exceptions/ErrorExceptions";
import {CoinError} from "../../core/exceptions/model/CoinError";

@Injectable()
export class CoinService {
    constructor(private readonly connection: Connection) {
    }

    async createCoinRate(form: CoinRateForm): Promise<string> {
        try {
            const exchangeRate = CoinRateFormToExchangeRateEntityMapper(form)

            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.startTransaction()
                await queryRunner.manager.save(exchangeRate)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not create exchange rate", CoinError.CAN_NOT_CREATE_EXCHANGE_RATE)
            } finally {
                await queryRunner.release()
            }

            return "Successfully, Exchange rate was created"
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}