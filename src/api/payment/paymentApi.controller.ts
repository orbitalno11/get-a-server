import { Controller, Get, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { PaymentApiService } from "./paymentApi.service"
import { launch } from "../../core/common/launch"
import SuccessResponse from "../../core/response/SuccessResponse"
import CoinPaymentTransaction from "../../model/payment/CoinPaymentTransaction"
import { CoinTransactionToPaymentMapper } from "../../utils/mapper/payment/CoinTransactionToPaymentMapper"
import { FailureResponseExceptionFilter } from "../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../interceptors/TransformSuccessResponse.interceptor"
import IResponse from "../../core/response/IResponse"

@Controller("v1/payment")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class PaymentApiController {
    constructor(private readonly service: PaymentApiService) {
    }

    @Get("confirm/linepay")
    async confirmLinePayPayment(@Query("transactionId") transactionId: string, @Query("orderId") orderId: string): Promise<IResponse<CoinPaymentTransaction>> {
        return launch(async () => {
            const updateResult = await this.service.confirmLinePayPayment(Number(transactionId), orderId)
            return SuccessResponse.create(CoinTransactionToPaymentMapper(updateResult))
        })
    }
}