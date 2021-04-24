import {Body, Controller, HttpStatus, Post, UseFilters, UseInterceptors} from "@nestjs/common";
import {FailureResponseExceptionFilter} from "../../core/exceptions/filters/FailureResponseException.filter";
import {ErrorExceptionFilter} from "../../core/exceptions/filters/ErrorException.filter";
import {TransformSuccessResponse} from "../../interceptors/TransformSuccessResponse.interceptor";
import {CoinService} from "./coin.service";
import CoinRateForm from "../../model/coin/CoinRateForm";
import {logger} from "../../core/logging/Logger";
import FailureResponse from "../../core/response/FailureResponse";
import ErrorExceptions from "../../core/exceptions/ErrorExceptions";
import {CreateCoinRateFormValidator} from "../../utils/validator/coin/CreateCoinRateFormValidator";
import SuccessResponse from "../../core/response/SuccessResponse";
import IResponse from "../../core/response/IResponse"

/**
 * Class for coin api controller
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/coin")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class CoinController {
    constructor(private readonly service: CoinService) {
    }

    /**
     * Create exchange rate
     * @param body
     */
    @Post("rate")
    async createCoinRate(@Body() body: CoinRateForm): Promise<IResponse<string>> {
        try {
            const data = CoinRateForm.createFormBody(body)
            const validator = new CreateCoinRateFormValidator(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("Coin rate data is invalid")
                throw FailureResponse.create("Coin rate data is invalid", HttpStatus.INTERNAL_SERVER_ERROR, validate.error)
            }

            const result = await this.service.createCoinRate(data)

            return SuccessResponse.create(result)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse || error instanceof ErrorExceptions) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}