import {Controller, Post, UseFilters, UseInterceptors} from "@nestjs/common";
import {FailureResponseExceptionFilter} from "../../core/exceptions/filters/FailureResponseException.filter";
import {ErrorExceptionFilter} from "../../core/exceptions/filters/ErrorException.filter";
import {TransformSuccessResponse} from "../../interceptors/TransformSuccessResponse.interceptor";
import {CoinService} from "./coin.service";

@Controller("v1/coin")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class CoinController {
    constructor(private readonly service: CoinService) {
    }

    @Post("rate")
    async createCoinRate() {

    }
}