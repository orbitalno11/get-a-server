import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { v4 as uuidV4 } from "uuid"
import CoinRate from "../../../model/coin/CoinRate"
import { logger } from "../../../core/logging/Logger"
import { CoinRateFormToExchangeRateEntityMapper } from "../../../utils/mapper/coin/CoinRateFormToExchangeRateEntityMapper"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import { CoinError } from "../../../core/exceptions/constants/coin.error"
import CoinRepository from "../../../repository/CoinRepository"
import { ExchangeRateEntityToCoinRateMapper } from "../../../utils/mapper/coin/ExchangeRateEntityToCoinRate.mapper"
import { UserRole } from "../../../core/constant/UserRole"
import { launch } from "../../../core/common/launch"
import CoinPayment from "../../../model/payment/CoinPayment"
import * as config from "../../../configs/EnvironmentConfig"

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
    async getCoinRateList(userRole: UserRole): Promise<CoinRate[]> {
        try {
            const result = await this.repository.getCoinRateList(userRole)
            return result.map(data => ExchangeRateEntityToCoinRateMapper(data))
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Buy coin from exchange rate id
     * @param userId
     * @param rateId
     */
    async buyCoin(userId: string, rateId: number): Promise<string> {
        return launch(async () => {
            const transactionId = "GET-A" + uuidV4()
            const rateDetail = await this.repository.getCoinRate(rateId)

            const orderDetail = new CoinPayment()
            orderDetail.transactionId = transactionId
            orderDetail.userId = userId
            orderDetail.amount = rateDetail.baht
            orderDetail.coinRate = rateDetail.id
            orderDetail.created = new Date()
            orderDetail.refNo1 = this.createRefNo(1)
            orderDetail.refNo2 = this.createRefNo(2)
            orderDetail.refNo3 = this.createRefNo(3)

            await this.repository.buyCoin(orderDetail, rateDetail)
            return transactionId
        })
    }

    /**
     * Create reference number
     * @param refNo
     * @private
     */
    private createRefNo(refNo: number): string {
        let result = []
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        const charactersLength = characters.length

        if (refNo != 3) {
            for (let index = 0; index < 3; index++) {
                result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
            }
            const resultString = result.join("")
            return `GETA${Date.now()}${resultString}`
        } else {
            for (let index = 0; index < 3; index++) {
                result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
            }
            const resultString = result.join("")
            return `${config.SCB_REF3_PREFIX}${Date.now()}${resultString}`
        }
    }
}