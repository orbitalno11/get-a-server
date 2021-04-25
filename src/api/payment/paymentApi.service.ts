import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import PaymentManager from "../../payment/PaymentManager"
import { launch } from "../../core/common/launch"
import PaymentRepository from "../../repository/PaymentRepository"
import { PaymentTransactionEntity } from "../../entity/payment/PaymentTransaction.entity"
import CoinPayment from "../../model/payment/CoinPayment"

/**
 * Service class for payment API
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class PaymentApiService {
    constructor(
        private readonly connection: Connection,
        private readonly repository: PaymentRepository,
        private readonly paymentManager: PaymentManager
    ) {
    }

    /**
     * Get payment detail from transaction id and user id
     * @param transactionId
     * @param userId
     */
    async getPaymentDetail(transactionId: string, userId: string): Promise<PaymentTransactionEntity> {
        return launch( async () => {
            return this.repository.getPaymentDetail(transactionId, userId)
        })
    }

    /**
     * Get payment detail from reference number
     * @param refNo1
     * @param refNo2
     * @param refNo3
     */
    async getPaymentDetailFromRefNo(refNo1: string, refNo2: string, refNo3: string): Promise<PaymentTransactionEntity> {
        return launch(async () => {
            return this.repository.getPaymentDetailFormRefNo(refNo1, refNo2, refNo3)
        })
    }

    /**
     * Create QR Code
     * @param paymentDetail
     */
    async createQrCodePayment(paymentDetail: CoinPayment): Promise<string> {
        return launch( async  () => {
            return await this.paymentManager.createQrCodePayment(paymentDetail)
        })
    }

    /**
     * Confirm payment
     * @param paymentDetail
     */
    async confirmPayment(paymentDetail: CoinPayment): Promise<void> {
        return launch( async () => {
            await this.repository.updatePaymentStatus(paymentDetail)
        })
    }
}