import got from "got"
import * as crypto from "crypto"
import { Injectable } from "@nestjs/common"
import { v4 as UUID } from "uuid"
import * as config from "../configs/EnvironmentConfig"
import RabbitLinePayResponse from "../model/payment/RabbitLinePayResponse"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { PaymentError } from "../model/payment/data/PaymentError"
import ErrorType from "../core/exceptions/model/ErrorType"
import { isNotEmpty } from "../core/extension/CommonExtension"
import CoinPaymentTransaction from "../model/payment/CoinPaymentTransaction"
import RabbitLinePayPayload from "../model/payment/RabbitLinePayPayload"
import RabbitLinePayConfirmPayload from "../model/payment/RabbitLinePayConfirmPayload"

/**
 * Class for manage payment
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class PaymentManager {
    private readonly CHANNEL_ID = config.LINE_PAY_CHANNEL_ID
    private readonly CHANNEL_SECRET = config.LINE_PAY_CHANNEL_SECRET
    private readonly REQUEST_CONTENT_TYPE = "application/json"

    private readonly LINE_PAY_URL = "https://sandbox-api-pay.line.me"
    private readonly LINE_PAY_API_VERSION = "v3"
    private readonly RESERVED_API = `${this.LINE_PAY_API_VERSION}/payments/request`
    private readonly RESERVED_REQUEST_URL = `${this.LINE_PAY_URL}/${this.RESERVED_API}`
    private readonly CONFIRM_API = `${this.LINE_PAY_API_VERSION}/payments`
    private readonly CONFIRM_TEXT = "confirm"

    private createHeader(url: string, payload: RabbitLinePayPayload | RabbitLinePayConfirmPayload, nonce: string) {
        const detail = payload.toJson()
        const data = this.CHANNEL_ID + url + detail + nonce
        const signature = crypto.createHmac("SHA256", this.CHANNEL_SECRET).update(data).digest("base64").toString()
        return {
            "Content-Type": this.REQUEST_CONTENT_TYPE,
            "X-LINE-ChannelId": this.CHANNEL_ID,
            "X-LINE-Authorization-Nonce": nonce,
            "X-LINE-Authorization": signature
        }
    }

    /**
     * Reserved payment by Rabbit LINE Pay
     * @param detail
     */
    async linePayReservedPayment(detail: CoinPaymentTransaction): Promise<RabbitLinePayResponse | null> {
        try {
            const payload = new RabbitLinePayPayload()
            payload.amount = detail.paymentDetail.baht
            payload.orderId = detail.transactionId
            payload.packages = [
                {
                    id: detail.paymentDetail.type,
                    amount: detail.paymentDetail.baht,
                    name: detail.paymentDetail.title,
                    products: [
                        {
                            name: detail.paymentDetail.title,
                            quantity: 1,
                            price: detail.paymentDetail.baht
                        }
                    ]
                }
            ]
            payload.redirectUrls = {
                confirmUrl: "https://fe8d2fa772e3.ngrok.io/v1/payment/confirm/linepay",
                cancelUrl: "https://fe8d2fa772e3.ngrok.io/v1/payment/confirm/linepay"
            }
            // payload.productName = paymentDetail.paymentDetail.title
            // payload.amount = paymentDetail.paymentDetail.baht
            // payload.confirmUrl = "https://1ba40fd20132.ngrok.io/v1/payment/confirm/linepay"

            const nonce = UUID()
            const header = this.createHeader(this.RESERVED_API, payload, nonce)
            console.log(header)
            const response = await got.post(this.RESERVED_REQUEST_URL, {
                headers: header,
                body: payload.toJson(),
                responseType: "json"
            })

            const responseBody = response.body as RabbitLinePayResponse
            console.log(responseBody)
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

    async linePayConfirmPayment(transactionId: number, orderDetail: CoinPaymentTransaction): Promise<boolean> {
        try {
            const pathUrl = `${this.CONFIRM_API}/${transactionId}/${this.CONFIRM_TEXT}`
            const url = `${this.LINE_PAY_URL}/${pathUrl}`

            const body = new RabbitLinePayConfirmPayload()
            body.amount = orderDetail.paymentDetail.baht

            const nonce = UUID()
            const header = this.createHeader(pathUrl, body, nonce)
            const response = await got.post(url, {
                headers: header,
                body: body.toJson(),
                responseType: "json"
            })

            const responseBody = response.body as RabbitLinePayResponse
            return isNotEmpty(responseBody) && responseBody.returnCode === "0000" && isNotEmpty(responseBody.info)
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw ErrorExceptions.create("Can not reserved with Rabbit LINE PAY", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default PaymentManager