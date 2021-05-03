import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import CommonError from "../core/exceptions/constants/common-error.enum"
import { PaymentTransactionEntity } from "../entity/payment/PaymentTransaction.entity"
import CoinPayment from "../model/payment/CoinPayment"
import { PaymentError } from "../core/exceptions/constants/payment-error.enum"

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
                            member: "transaction.member"
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

            // update entity
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(updatePayment)
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
}

export default PaymentRepository