import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import CommonError from "../core/exceptions/constants/common-error.enum"
import { PaymentTransactionEntity } from "../entity/payment/PaymentTransaction.entity"
import CoinPayment from "../model/payment/CoinPayment"
import { PaymentError } from "../core/exceptions/constants/payment-error.enum"
import { CoinEntity } from "../entity/coins/coin.entity"
import { MemberEntity } from "../entity/member/member.entitiy"
import { CoinTransactionEntity } from "../entity/coins/CoinTransaction.entity"
import { CoinTransactionType } from "../model/coin/data/CoinTransactionType.enum"
import { ExchangeRateEntity } from "../entity/coins/exchangeRate.entity"

/**
 * Repository for "v1/payment"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class PaymentRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get payment detail from transaction id and user id
     * @param transactionId
     * @param userId
     */
    async getPaymentDetail(transactionId: string, userId: string): Promise<PaymentTransactionEntity> {
        try {
            return await this.connection.getRepository(PaymentTransactionEntity)
                .findOne({
                    where: {
                        transactionId: transactionId,
                        member: userId
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get order detail", PaymentError.CAN_NOT_FOUND_TRANSACTION)
        }
    }

    /**
     * Get payment detail from reference number
     * @param refNo1
     * @param refNo2
     * @param refNo3
     */
    async getPaymentDetailFormRefNo(refNo1: string, refNo2: string, refNo3: string): Promise<PaymentTransactionEntity> {
        try {
            return await this.connection.getRepository(PaymentTransactionEntity)
                .findOne({
                    where: {
                        refNo1: refNo1,
                        refNo2: refNo2,
                        refNo3: refNo3
                    },
                    join: {
                        alias: "transaction",
                        leftJoinAndSelect: {
                            member: "transaction.member",
                            exchangeRate: "transaction.exchangeRate"
                        }
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get order detail", PaymentError.CAN_NOT_FOUND_TRANSACTION)
        }
    }

    /**
     * Update payment status
     * @param paymentDetail
     */
    async updatePaymentStatus(paymentDetail: CoinPayment): Promise<void> {
        try {
            const updatePayment = new PaymentTransactionEntity()
            updatePayment.transactionId = paymentDetail.transactionId
            updatePayment.paymentTransId = paymentDetail.paymentTransId
            updatePayment.paymentStatus = paymentDetail.status

            const member = new MemberEntity()
            member.id = paymentDetail.userId

            // update entity
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()

                const coinRate = await queryRunner.manager.findOne(ExchangeRateEntity, { id: paymentDetail.coinRate })
                const coinResult = await queryRunner.manager.findOne(CoinEntity, { member: member })
                const coin = this.createCoinEntity(coinResult, member, coinRate?.coin)
                const transaction = this.createCoinTransaction(paymentDetail.transactionId, coinRate?.coin, member)

                await queryRunner.manager.save(updatePayment)
                await queryRunner.manager.save(transaction)
                await queryRunner.manager.save(coin)

                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not update payment status", PaymentError.CAN_NOT_UPDATE_TRANSACTION)
            } finally {
                await queryRunner.release()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw ErrorExceptions.create("Can not update payment status", CommonError.UNEXPECTED_ERROR)
        }
    }

    /**
     * Create CoinEntity with update data
     * @param coinEntity
     * @param member
     * @param numberOfCoin
     * @private
     */
    private createCoinEntity(
        coinEntity: CoinEntity,
        member: MemberEntity,
        numberOfCoin: number
    ): CoinEntity {
        let coin
        if (coinEntity) {
            coin = coinEntity
        } else {
            coin = new CoinEntity()
            coin.member = member
            coin.amount = 0
        }
        coin.amount += numberOfCoin
        return coin
    }

    /**
     * Create transaction entity
     * @param transactionId
     * @param numberOfCoin
     * @param member
     * @private
     */
    private createCoinTransaction(
        transactionId: string,
        numberOfCoin: number,
        member: MemberEntity
    ): CoinTransactionEntity {
        const transaction = new CoinTransactionEntity()
        transaction.transactionId = transactionId
        transaction.member = member
        transaction.transactionType = CoinTransactionType.DEPOSIT
        transaction.numberOfCoin = numberOfCoin
        transaction.transactionDate = new Date()
        return transaction
    }
}

export default PaymentRepository