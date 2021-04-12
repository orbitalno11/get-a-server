import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { CoinTransactionEntity } from "../entity/coins/coinTransaction.entity"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import ErrorType from "../core/exceptions/model/ErrorType"
import { PaymentStatus } from "../model/payment/data/PaymentStatus"
import { PaymentError } from "../model/payment/data/PaymentError"

@Injectable()
class PaymentRepository {
    constructor(private readonly connection: Connection) {
    }

    async getPaymentDetail(orderId: string): Promise<CoinTransactionEntity> {
        try {
            return await this.connection.createQueryBuilder(CoinTransactionEntity, "transaction")
                .leftJoinAndSelect("transaction.exchangeRate", "exchangeRate")
                .where("transaction.transactionId like :orderId", { orderId: orderId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get order detail", ErrorType.UNEXPECTED_ERROR)
        }
    }

    async updatePaymentStatus(paymentDetail: CoinTransactionEntity, paymentStatus: boolean): Promise<CoinTransactionEntity> {
        try {
            if (paymentStatus) {
                paymentDetail.paymentStatus = PaymentStatus.PAID
            } else {
                paymentDetail.paymentStatus = PaymentStatus.FAILED
            }

            // update entity
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(paymentDetail)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not update payment status", PaymentError.CAN_NOT_UPDATE_TRANSACTION)
            } finally {
                await queryRunner.release()
            }

            return await this.getPaymentDetail(paymentDetail.transactionId)
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw ErrorExceptions.create("Can not update payment status", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default PaymentRepository