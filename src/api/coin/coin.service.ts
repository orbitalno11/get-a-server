import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import CoinRate from "../../model/coin/CoinRate"
import {logger} from "../../core/logging/Logger"
import {ExchangeRateEntity} from "../../entity/coins/exchangeRate.entity"
import {CoinRateFormToExchangeRateEntityMapper} from "../../utils/mapper/coin/CoinRateFormToExchangeRateEntityMapper"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import {CoinError} from "../../core/exceptions/model/CoinError"
import {CoinRateType} from "../../model/coin/data/CoinRateType"
import CoinRepository from "../../repository/CoinRepository"
import {ExchangeRateEntityToCoinRateMapper} from "../../utils/mapper/coin/ExchangeRateEntityToCoinRateMapper"
import {UserRoleKey} from "../../core/constant/UserRole"

/**
 * Class for coin api service
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class CoinService {
    constructor(
        private readonly connection: Connection,
        private readonly repository: CoinRepository
    ) {
    }

    /**
     * Create an exchange coin rate data
     * @param form
     */
    async createCoinRate(form: CoinRate): Promise<string> {
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

    /**
     * Get coin rate depend on user role
     * @param userRole
     */
    async getCoinRateList(userRole: UserRoleKey): Promise<CoinRate[]> {
        try {
            const result = await this.repository.getCoinRateList(userRole)
            return result.map(data => ExchangeRateEntityToCoinRateMapper(data))
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}