import { Body, Controller, Get, Post, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { PaymentApiService } from "./paymentApi.service"
import { launch } from "../../core/common/launch"
import SuccessResponse from "../../core/response/SuccessResponse"
import { FailureResponseExceptionFilter } from "../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../interceptors/TransformSuccessResponse.interceptor"
import IResponse from "../../core/response/IResponse"
import { CurrentUser } from "../../decorator/CurrentUser.decorator"
import { logger } from "../../core/logging/Logger"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import { PaymentError } from "../../model/payment/data/PaymentError"
import ScbConfirmBody from "../../model/payment/ScbConfirmBody"
import { isEmpty } from "../../core/extension/CommonExtension"
import { PaymentTransactionToCoinPayment } from "../../utils/mapper/payment/PaymentTransactionToCoinPaymentMapper"
import { PaymentStatus } from "../../model/payment/data/PaymentStatus"

/**
 * Controller for "v1/payment"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/payment")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class PaymentApiController {
    constructor(private readonly service: PaymentApiService) {
    }

    /**
     * Get QR Code for payment
     * @param currentUserId
     * @param transactionId
     */
    @Get("pay/qrcode")
    async getQrCodePayment(@CurrentUser("id") currentUserId: string, @Query("transId") transactionId: string): Promise<IResponse<string>> {
        return launch(async () => {
            const paymentDetail = await this.service.getPaymentDetail(transactionId, currentUserId)
            if (isEmpty(paymentDetail)) {
                logger.error("Can not found payment detail")
                throw ErrorExceptions.create("Can not found payment detail", PaymentError.CAN_NOT_FOUND_TRANSACTION)
            }
            const qrCode = await this.service.createQrCodePayment(PaymentTransactionToCoinPayment(paymentDetail))
            return SuccessResponse.create(qrCode)
        })
    }

    @Get("/pay/scbeasy")
    async getScbEasyLink(@CurrentUser("id") currentUserId: string, @Query("transId") transactionId: string): Promise<IResponse<string>> {
        return launch(async () => {
            const paymentDetail = await this.service.getPaymentDetail(transactionId, currentUserId)
            if (isEmpty(paymentDetail)) {
                logger.error("Can not found payment detail")
                throw ErrorExceptions.create("Can not found payment detail", PaymentError.CAN_NOT_FOUND_TRANSACTION)
            }
            const deepLink = await this.service.createScbEasyPayment(PaymentTransactionToCoinPayment(paymentDetail))
            return SuccessResponse.create(deepLink)
        })
    }

    /**
     * Confirm payment
     * @param body
     */
    @Post("confirm")
    async confirmPayment(@Body() body: ScbConfirmBody): Promise<IResponse<string>> {
        return launch(async () => {
            if (isEmpty(body)) {
                logger.error("Can not found payment detail form bank service")
                throw ErrorExceptions.create("Can not found payment detail form bank service", PaymentError.CAN_NOT_FOUND_PAYMENT_DETAIL_FROM_BANK_SERVICE)
            }
            const paymentDetail = await this.service.getPaymentDetailFromRefNo(body.billPaymentRef1, body.billPaymentRef2, body.billPaymentRef3)
            if (isEmpty(paymentDetail)) {
                logger.error("Can not found payment detail")
                throw ErrorExceptions.create("Can not found payment detail", PaymentError.CAN_NOT_FOUND_TRANSACTION)
            }
            paymentDetail.paymentTransId = body.transactionId
            paymentDetail.paymentStatus = PaymentStatus.PAID
            await this.service.confirmPayment(PaymentTransactionToCoinPayment(paymentDetail))
            return SuccessResponse.create("Confirm payment success")
        })
    }
}