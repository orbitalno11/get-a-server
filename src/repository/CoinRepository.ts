import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import {logger} from "../core/logging/Logger"
import {ExchangeRateEntity} from "../entity/coins/exchangeRate.entity"
import {CoinRateType} from "../model/coin/data/CoinRateType"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import ErrorType from "../core/exceptions/model/ErrorType"
import {UserRoleKey} from "../core/constant/UserRole"
import UserManager from "../utils/UserManager"
import { CoinTransactionEntity } from "../entity/coins/coinTransaction.entity"
import { PaymentStatus } from "../model/payment/data/PaymentStatus"
import { PaymentError } from "../model/payment/data/PaymentError"

/**
 * Repository for "v1/coin"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class CoinRepository {
    constructor(
        private readonly connection: Connection,
        private readonly userManager: UserManager
    ) {
    }

    /**
     * Get coin rate depend on user role
     * @param userRole
     */
    async getCoinRateList(userRole: UserRoleKey): Promise<ExchangeRateEntity[]> {
        try {
            switch (userRole) {
                case UserRoleKey.ADMIN: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate").getMany()
                }
                case UserRoleKey.TUTOR: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
                case UserRoleKey.LEARNER: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.type not like :type", {type: CoinRateType.TRANSFER})
                        .andWhere("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
                default: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.type not like :type", {type: CoinRateType.TRANSFER})
                        .andWhere("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get exchange rate", ErrorType.UNEXPECTED_ERROR)
        }
    }

    /**
     * Get coin rate from rate id
     * @param rateId
     */
    async getCoinRate(rateId: number): Promise<ExchangeRateEntity> {
        try {
            return await this.connection.getRepository(ExchangeRateEntity).findOne(rateId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get exchange rate", ErrorType.UNEXPECTED_ERROR)
        }
    }

    /**
     * Buy coin
     * @param transactionId
     * @param paymentId
     * @param userId
     * @param rateDetail
     */
    async buyCoin(transactionId: string, paymentId: number, userId: string, rateDetail: ExchangeRateEntity): Promise<CoinTransactionEntity> {
        try {
            const memberData = await this.userManager.getMember(userId)
            const coinTransaction = new CoinTransactionEntity()
            coinTransaction.transactionId = transactionId
            coinTransaction.paymentId = paymentId
            coinTransaction.member = memberData
            coinTransaction.exchangeRate = rateDetail
            coinTransaction.paymentStatus = PaymentStatus.WAITING_FOR_PAYMENT
            coinTransaction.transactionDate = new Date()

            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.startTransaction()
                await queryRunner.manager.save(coinTransaction)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not create transaction", PaymentError.CAN_NOT_CREATE_TRANSACTION)
            } finally {
                await queryRunner.release()
            }
            return coinTransaction
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not create transaction", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default CoinRepository