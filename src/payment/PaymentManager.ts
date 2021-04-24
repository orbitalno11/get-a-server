import got from "got"
import { Injectable } from "@nestjs/common"
import { v4 as UUID } from "uuid"
import * as config from "../configs/EnvironmentConfig"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import ErrorType from "../core/exceptions/model/ErrorType"
import CoinPaymentTransaction from "../model/payment/CoinPaymentTransaction"
import ScbQrCodePayload from "../model/payment/ScbQrCodePayload"
import ScbTokenResponse from "../model/payment/ScbTokenResponse"
import ScbQrCodeResponse from "../model/payment/ScbQrCodeResponse"

/**
 * Class for manage payment
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class PaymentManager {
    private readonly REQUEST_CONTENT_TYPE = "application/json"

    private readonly SCB_API_KEY = config.SCB_API_KEY
    private readonly SCB_API_SECRET = config.SCB_API_SECRET
    private readonly SCB_SANDBOX_URL = config.SCB_SANDBOX_URL
    private readonly SCB_BILLER_ID = config.SCB_BILLER_ID

    private async getScbOpenApiToken(): Promise<string | null> {
        try {
            const requestUId = UUID()
            const header = {
                "Content-Type": this.REQUEST_CONTENT_TYPE,
                "resourceOwnerId": this.SCB_API_KEY,
                "requestUId": requestUId
            }

            const data = {
                "applicationKey": this.SCB_API_KEY,
                "applicationSecret": this.SCB_API_SECRET
            }

            const url = this.SCB_SANDBOX_URL + "v1/oauth/token"
            const response = await got.post("https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token", {
                headers: header,
                body: JSON.stringify(data),
                responseType: "json"
            })

            const result = response.body as ScbTokenResponse

            return result?.data?.accessToken
        } catch (error) {
            logger.error(error)
            return null
        }
    }

    private async createHeader() {
        try {
            const requestUId = UUID()
            const token = await this.getScbOpenApiToken()
            return {
                "Content-Type": this.REQUEST_CONTENT_TYPE,
                "resourceOwnerId": this.SCB_API_KEY,
                "requestUId": requestUId,
                "authorization": "Bearer " + token
            }
        } catch (error) {
            logger.error(error)
            return null
        }
    }

    async createQrCodePayment(detail: CoinPaymentTransaction): Promise<string> {
        try {
            const url = this.SCB_SANDBOX_URL + "/v1/payment/qrcode/create"
            const header = await this.createHeader()
            const data = new ScbQrCodePayload()
            data.amount = 10.0
            data.ppType = "BILLERID"
            data.ppId = this.SCB_BILLER_ID
            data.ref1 = detail.refNo1
            data.ref2 = detail.refNo2
            data.ref3 = detail.refNo3

            const response = await got.post("https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create", {
                headers: header,
                body: data.toJson(),
                responseType: "json"
            })

            const result = response.body as ScbQrCodeResponse

            return result?.data?.qrImage
        } catch (error) {
            console.log(error)
            logger.error(error)
            throw ErrorExceptions.create("Can not create QR code", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default PaymentManager