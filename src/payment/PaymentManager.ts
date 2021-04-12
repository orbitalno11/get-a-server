import CoinPaymentTransaction from "../model/payment/CoinPaymentTransaction"
import RabbitLinePayPayload from "../model/payment/RabbitLinePayPayload"
import got from "got"
import { Injectable } from "@nestjs/common"
import * as config from "../configs/EnvironmentConfig"
import RabbitLinePayResponse from "../model/payment/RabbitLinePayResponse"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { PaymentError } from "../model/payment/data/PaymentError"
import ErrorType from "../core/exceptions/model/ErrorType"

/**
 * Class for manage payment
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class PaymentManager {
    /**
     * Reserved payment by Rabbit LINE Pay
     * @param paymentDetail
     */
    async linePayReservedPayment(paymentDetail: CoinPaymentTransaction): Promise<RabbitLinePayResponse | null> {
        try {
            const payload = new RabbitLinePayPayload()
            payload.orderId = paymentDetail.transactionId
            payload.productName = paymentDetail.paymentDetail.title
            payload.amount = paymentDetail.paymentDetail.baht
            payload.confirmUrl = "https://get-a.dev.sitthinon.me/confirmPayment"

            const header = {
                "X-LINE-ChannelId": config.LINE_PAY_CHANNEL_ID,
                "X-LINE-ChannelSecret": config.LINE_PAY_CHANNEL_SECRET,
                "Content-Type": "application/json"
            }

            const url = "https://sandbox-api-pay.line.me/v2/payments/request"
            const response = await got.post(url, {
                headers: header,
                body: payload.toJson(),
                responseType: "json"
            })

            const responseBody = response.body as RabbitLinePayResponse
            if (responseBody && responseBody.returnCode === "0000" && responseBody.info) {
                return responseBody
            } else {
                throw ErrorExceptions.create("Can not reserved with Rabbit LINE PAY", PaymentError.LINE_PAY_RESPONSE_ERROR)
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw ErrorExceptions.create("Can not reserved with Rabbit LINE PAY", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default PaymentManager