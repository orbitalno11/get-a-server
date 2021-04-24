import { Body, Controller, Get, Post, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { PaymentApiService } from "./paymentApi.service"
import { launch } from "../../core/common/launch"
import SuccessResponse from "../../core/response/SuccessResponse"
import CoinPaymentTransaction from "../../model/payment/CoinPaymentTransaction"
import { FailureResponseExceptionFilter } from "../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../interceptors/TransformSuccessResponse.interceptor"
import IResponse from "../../core/response/IResponse"
import { CurrentUser } from "../../decorator/CurrentUser.decorator"
import { logger } from "../../core/logging/Logger"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import { PaymentError } from "../../model/payment/data/PaymentError"
import ScbConfirmBody from "../../model/payment/ScbConfirmBody"

@Controller("v1/payment")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class PaymentApiController {
    constructor(private readonly service: PaymentApiService) {
    }

    @Post("pay/qrcode")
    async getQrCodePayment(@CurrentUser("id") currentUserId: string, @Body() orderDetail: CoinPaymentTransaction): Promise<IResponse<string>> {
        return launch(async () => {
            if (currentUserId !== orderDetail.userId) {
                logger.error("User ID not match")
                throw ErrorExceptions.create("User is not match with order detail", PaymentError.USER_IS_NOT_MATCH)
            }
            const qrCode = await this.service.createQrCodePayment(orderDetail)
            return SuccessResponse.create(qrCode)
        })
    }

    @Post("confirm")
    async confirmPayment(@Body() body: ScbConfirmBody) {
        console.log(body)
        return SuccessResponse.create("DEV")
    }
}