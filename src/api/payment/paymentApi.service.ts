import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import PaymentManager from "../../payment/PaymentManager"
import { launch } from "../../core/common/launch"
import { CoinTransactionToPaymentMapper } from "../../utils/mapper/payment/CoinTransactionToPaymentMapper"
import PaymentRepository from "../../repository/PaymentRepository"
import { CoinTransactionEntity } from "../../entity/coins/coinTransaction.entity"

@Injectable()
export class PaymentApiService {
    constructor(
        private readonly connection: Connection,
        private readonly repository: PaymentRepository,
        private readonly paymentManager: PaymentManager
    ) {
    }

    async confirmLinePayPayment(transactionId: number, orderId: string): Promise<CoinTransactionEntity> {
        return launch(async () => {
            const coinExchangeData = await this.repository.getPaymentDetail(orderId)
            const confirmResult = await this.paymentManager.linePayConfirmPayment(transactionId, CoinTransactionToPaymentMapper(coinExchangeData))
            return await this.repository.updatePaymentStatus(coinExchangeData, confirmResult)
        })
    }
}