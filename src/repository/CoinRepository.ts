import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import {logger} from "../core/logging/Logger"
import {ExchangeRateEntity} from "../entity/coins/exchangeRate.entity"
import {CoinRateType} from "../model/coin/data/CoinRateType"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import ErrorType from "../core/exceptions/model/ErrorType"
import {UserRoleKey} from "../core/constant/UserRole"
import UserManager from "../utils/UserManager"
import { PaymentError } from "../model/payment/data/PaymentError"
import { MemberEntity } from "../entity/member/member.entitiy"
import { PaymentTransactionEntity } from "../entity/payment/PaymentTransaction.entity"
import CoinPayment from "../model/payment/CoinPayment"

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
     * @param orderDetail
     * @param exchangeRate
     */
    async buyCoin(orderDetail: CoinPayment, exchangeRate: ExchangeRateEntity): Promise<void> {
        try {
            const paymentTransaction = new PaymentTransactionEntity()
            const memberData = new MemberEntity()
            memberData.id = orderDetail.userId
            paymentTransaction.transactionId = orderDetail.transactionId
            paymentTransaction.member = memberData
            paymentTransaction.exchangeRate = exchangeRate
            paymentTransaction.amount = orderDetail.amount
            paymentTransaction.created = orderDetail.created
            paymentTransaction.refNo1 = orderDetail.refNo1
            paymentTransaction.refNo2 = orderDetail.refNo2
            paymentTransaction.refNo3 = orderDetail.refNo3

            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.startTransaction()
                await queryRunner.manager.save(paymentTransaction)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not create transaction", PaymentError.CAN_NOT_CREATE_TRANSACTION)
            } finally {
                await queryRunner.release()
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not create transaction", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default CoinRepository