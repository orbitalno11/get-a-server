import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { ExchangeRateEntity } from "../entity/coins/exchangeRate.entity"
import { CoinRateType } from "../model/coin/data/CoinRateType"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import CommonError from "../core/exceptions/constants/common-error.enum"
import { UserRole } from "../core/constant/UserRole"
import { PaymentError } from "../core/exceptions/constants/payment-error.enum"
import { MemberEntity } from "../entity/member/member.entitiy"
import { PaymentTransactionEntity } from "../entity/payment/PaymentTransaction.entity"
import CoinPayment from "../model/payment/CoinPayment"
import { CoinError } from "../core/exceptions/constants/coin.error"
import CoinRate from "../model/coin/CoinRate"
import { CoinRateFormToExchangeRateEntityMapper } from "../utils/mapper/coin/CoinRateFormToExchangeRateEntityMapper"
import { RedeemTransactionEntity } from "../entity/coins/RedeemTransaction.entity"
import RedeemForm from "../model/coin/RedeemForm"
import { CoinEntity } from "../entity/coins/coin.entity"
import User from "../model/User"
import { BankEntity } from "../entity/common/Bank.entity"
import { CoinRedeemStatus } from "../model/coin/data/CoinTransaction.enum"
import { isNotEmpty } from "../core/extension/CommonExtension"

/**
 * Repository for "v1/coin"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class CoinRepository {
    constructor(
        private readonly connection: Connection
    ) {
    }

    /**
     * Create an exchange coin rate data
     * @param data
     */
    async createCoinRate(data: CoinRate) {
        try {
            const exchangeRate = CoinRateFormToExchangeRateEntityMapper(data)
            await this.connection.getRepository(ExchangeRateEntity).save(exchangeRate)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not create exchange rate", CoinError.CAN_NOT_CREATE_EXCHANGE_RATE)
        }
    }

    /**
     * Get coin rate by rate id
     * @param rateId
     */
    async getCoinRateById(rateId: number): Promise<ExchangeRateEntity> {
        try {
            return await this.connection.getRepository(ExchangeRateEntity).findOne(rateId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get coin rate", CoinError.CAN_NOT_GET_RATE)
        }
    }

    /**
     * Get coin rate depend on user role
     * @param userRole
     */
    async getCoinRateList(userRole: UserRole): Promise<ExchangeRateEntity[]> {
        try {
            switch (userRole) {
                case UserRole.ADMIN: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate").getMany()
                }
                case UserRole.TUTOR: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
                case UserRole.LEARNER: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.type not like :type", { type: CoinRateType.TRANSFER })
                        .andWhere("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
                default: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.type not like :type", { type: CoinRateType.TRANSFER })
                        .andWhere("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get exchange rate", CoinError.CAN_NOT_GET_RATE)
        }
    }

    /**
     * Edit coin rate
     * @param rate
     * @param data
     */
    async editCoinRate(rate: ExchangeRateEntity, data: CoinRate) {
        try {
            rate.title = data.title
            rate.baht = data.baht
            rate.coin = data.coin
            rate.type = data.type
            rate.startDate = data.startDate
            rate.endDate = data.endDate
            rate.updated = new Date()
            await this.connection.getRepository(ExchangeRateEntity).save(rate)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not edit exchange rate", CoinError.CAN_NOT_EDIT_RATE)
        }
    }

    /**
     * Delete coin rate
     * @param rate
     */
    async deleteCoinRate(rate: ExchangeRateEntity) {
        try {
            await this.connection.getRepository(ExchangeRateEntity).remove(rate)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not edit exchange rate", CoinError.CAN_NOT_DELETE_RATE)
        }
    }

    /**
     * Check sell rate already use
     * sell rate: std, promo, deal
     * @param rateId
     */
    async checkUsedSellRate(rateId: number): Promise<boolean> {
        try {
            const usage = await this.connection.getRepository(PaymentTransactionEntity).findOne({
                where: {
                    exchangeRate: rateId
                }
            })
            return isNotEmpty(usage)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not check coin rate", CoinError.CAN_NOT_CHECK_RATE)
        }
    }

    /**
     * Check redeem transfer rate already use
     * @param rateId
     */
    async checkUsedTransferRate(rateId: number): Promise<boolean> {
        try {
            const usage = await this.connection.getRepository(RedeemTransactionEntity).findOne({
                where: {
                    exchangeRate: rateId
                }
            })
            return isNotEmpty(usage)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not check coin rate", CoinError.CAN_NOT_CHECK_RATE)
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
            throw ErrorExceptions.create("Can not create transaction", CommonError.UNEXPECTED_ERROR)
        }
    }

    /**
     * Create redeem request
     * @param data
     * @param balance
     * @param rate
     * @param bank
     * @param fileUrl
     * @param user
     */
    async redeemCoin(data: RedeemForm, balance: CoinEntity, rate: ExchangeRateEntity, bank: BankEntity, fileUrl: string, user: User) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const member = new MemberEntity()
            member.id = user.id

            const redeem = new RedeemTransactionEntity()
            redeem.member = member
            redeem.exchangeRate = rate
            redeem.bank = bank
            redeem.accountNo = data.accountNo
            redeem.accountName = data.accountName
            redeem.accountPic = fileUrl
            redeem.amount = data.amount
            redeem.amountCoin = data.numberOfCoin
            redeem.requestDate = new Date()
            redeem.requestStatus = CoinRedeemStatus.REQUEST_REDEEM_SENT

            balance.amount = balance.amount - data.numberOfCoin
            balance.updated = new Date()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(redeem)
            await queryRunner.manager.save(balance)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not create redeem", CoinError.CAN_NOT_CREATE_REDEEM)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get bank detail by bank id
     * @param bankId
     */
    async getBankDetailById(bankId: string): Promise<BankEntity> {
        try {
            return await this.connection.getRepository(BankEntity).findOne(bankId)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get bank detail", CoinError.CAN_NOT_GET_BANK)
        }
    }

    /**
     * Get redeem coin by id
     * @param redeemId
     */
    async getRedeemCoinById(redeemId: number): Promise<RedeemTransactionEntity> {
        try {
            return await this.connection.createQueryBuilder(RedeemTransactionEntity, "transaction")
                .leftJoinAndSelect("transaction.member", "member")
                .leftJoinAndSelect("transaction.exchangeRate", "rate")
                .leftJoinAndSelect("transaction.bank", "bank")
                .where("transaction.id = :redeemId", { redeemId: redeemId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get redeem detail", CoinError.CAN_NOT_GET_REDEEM)
        }
    }

    /**
     * Get redeem coin list
     * @param status
     */
    async getRedeemCoinList(status: number): Promise<Array<RedeemTransactionEntity>> {
        try {
            return await this.connection.createQueryBuilder(RedeemTransactionEntity, "transaction")
                .leftJoinAndSelect("transaction.member", "member")
                .leftJoinAndSelect("transaction.exchangeRate", "rate")
                .leftJoinAndSelect("transaction.bank", "bank")
                .where("transaction.requestStatus = :status", { status: status })
                .orderBy("transaction.requestDate", "ASC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get redeem detail", CoinError.CAN_NOT_GET_REDEEM)
        }
    }

    /**
     * Cancel redeem request
     * @param detail
     * @param userBalance
     */
    async cancelRedeemCoinById(detail: RedeemTransactionEntity, userBalance: CoinEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            userBalance.amount = userBalance.amount + detail.amountCoin

            detail.requestStatus = CoinRedeemStatus.REQUEST_REDEEM_CANCELED
            detail.transferDate = new Date()
            detail.approveDate = new Date()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(detail)
            await queryRunner.manager.save(userBalance)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not cancel redeem request", CoinError.CAN_NOT_CANCEL_REDEEM_REQUEST)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Denied redeem request
     * @param detail
     * @param userBalance
     */
    async deniedRedeemCoinById(detail: RedeemTransactionEntity, userBalance: CoinEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            userBalance.amount = userBalance.amount + detail.amountCoin

            detail.requestStatus = CoinRedeemStatus.REQUEST_REDEEM_DENIED
            detail.transferDate = new Date()
            detail.approveDate = new Date()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(detail)
            await queryRunner.manager.save(userBalance)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not denied redeem request", CoinError.CAN_NOT_DENIED_REDEEM_REQUEST)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Approved redeem request
     * @param detail
     */
    async approvedRedeemCoinById(detail: RedeemTransactionEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            detail.requestStatus = CoinRedeemStatus.REQUEST_REDEEM_APPROVED
            detail.transferDate = new Date()
            detail.approveDate = new Date()

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(detail)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not approved redeem request", CoinError.CAN_NOT_APPROVED_REDEEM_REQUEST)
        } finally {
            await queryRunner.release()
        }
    }

}

export default CoinRepository