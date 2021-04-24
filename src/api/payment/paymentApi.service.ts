import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import PaymentManager from "../../payment/PaymentManager"
import { launch } from "../../core/common/launch"
import PaymentRepository from "../../repository/PaymentRepository"
import CoinPaymentTransaction from "../../model/payment/CoinPaymentTransaction"

@Injectable()
export class PaymentApiService {
    constructor(
        private readonly connection: Connection,
        private readonly repository: PaymentRepository,
        private readonly paymentManager: PaymentManager
    ) {
    }

    async createQrCodePayment(orderDetail: CoinPaymentTransaction): Promise<string> {
        return launch( async  () => {
            return await this.paymentManager.createQrCodePayment(orderDetail)
        })
    }

    async confirmPayment() {

    }
}